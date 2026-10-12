# Foodgood

鵝香鵝肉餐廳的品牌介紹與菜單網站，使用 [Angular](https://angular.dev) 22（standalone、zoneless、esbuild application builder），公開頁面於建置時預先渲染（SSG）為靜態 HTML。

## 環境需求

- Node.js 24.15+（或 22.22.3+），版本記錄於 `.nvmrc`，可執行 `nvm use`
- npm

## 常用指令

| 指令             | 說明                                            |
| ---------------- | ----------------------------------------------- |
| `npm start`      | 啟動開發伺服器 `http://localhost:4200/`         |
| `npm run build`  | 正式版建置，輸出至 `dist/foodgood/browser`      |
| `npm test`       | 以 Vitest 執行單元測試                          |
| `npm run format` | 以 Prettier 格式化程式碼（`format:check` 檢查） |
| `npm run deploy` | 建置並部署至 Firebase Hosting                   |

## 資料

- 店家資訊（地址、電話、營業時間、品牌文案）：`src/assets/data/store.ts`
- 菜單與合菜：`src/assets/data/goose.ts`

## SEO

- 預先渲染路由：`/`、`/menu`、`/menu-collection`（`src/app/app.routes.server.ts`），其餘為前端渲染
- 各頁標題、描述、canonical、Open Graph 由 `src/app/seo/seo.service.ts` 依路由 `data.seo` 產生；標題格式為「頁面關鍵字｜鵝香鵝肉餐廳」
- 結構化資料（`src/app/seo/structured-data.ts`）：首頁輸出 WebSite + Restaurant，菜單與合菜頁輸出 Menu
- `npm run build` 會在建置後（`scripts/postbuild.mjs`）依各頁 canonical 產生 `sitemap.xml`、`robots.txt`，並產生 `404.html`；請勿直接使用 `ng build` 部署
- 不需索引的頁面（`/menu-create`、404）以 noindex meta 與 `X-Robots-Tag` 標頭處理，不在 robots.txt 封鎖
- 正式網址只定義在 `src/assets/data/store.ts` 的 `siteUrl`，更換網域只需修改此處
