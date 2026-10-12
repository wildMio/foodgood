// 建置後處理：
// 1. 以預先渲染頁面的 canonical 產生 sitemap.xml 與 robots.txt（網址唯一來源為 store.ts 的 siteUrl）
// 2. 以前端渲染版本產生 Firebase Hosting 的 404.html（回傳 404 狀態碼並禁止索引）
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const dir = "dist/foodgood/browser";

const findPages = (folder) =>
  readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) return findPages(path);
    return entry.name === "index.html" ? [path] : [];
  });

const urls = findPages(dir)
  .map((file) => {
    const html = readFileSync(file, "utf8");
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
    if (!canonical && !noindex) {
      throw new Error(`${relative(dir, file)} 缺少 canonical`);
    }
    return noindex ? null : canonical;
  })
  .filter(Boolean)
  .sort();

const origin = new URL(urls[0]).origin;

writeFileSync(
  `${dir}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join("\n")}
</urlset>
`
);

// 不需索引的頁面以 noindex（HTML 與 X-Robots-Tag）處理，不在此封鎖，
// 否則搜尋引擎無法讀到 noindex
writeFileSync(
  `${dir}/robots.txt`,
  `User-agent: *
Disallow:

Sitemap: ${origin}/sitemap.xml
`
);

const csr = readFileSync(`${dir}/index.csr.html`, "utf8");
writeFileSync(
  `${dir}/404.html`,
  csr.replace("<head>", '<head>\n    <meta name="robots" content="noindex" />')
);

console.log(`Created sitemap.xml (${urls.length} URLs), robots.txt, 404.html`);
