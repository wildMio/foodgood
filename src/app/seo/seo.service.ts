import { DOCUMENT, Injectable, PendingTasks, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import { store } from '../../assets/data/store';
import type { JsonLdPage } from './structured-data';

export interface SeoData {
  description?: string;
  /** 不希望被索引的頁面（內部工具、404） */
  noindex?: boolean;
  /** 該頁輸出的結構化資料 */
  jsonLd?: JsonLdPage;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly pendingTasks = inject(PendingTasks);

  update(title: string, path: string, data: SeoData) {
    const url = `${store.siteUrl}${path}`;
    const description = data.description ?? store.intro[0];

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({
      property: 'og:image',
      content: `${store.siteUrl}${store.ogImage}`,
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: `${store.siteUrl}${store.ogImage}`,
    });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    if (data.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex' });
      this.setCanonical(null);
    } else {
      this.meta.removeTag('name="robots"');
      this.setCanonical(url);
    }

    // 結構化資料含完整菜單，延遲載入以免增加首屏 bundle；
    // PendingTasks 讓預先渲染等待其完成後才輸出 HTML
    const jsonLd = data.jsonLd;
    if (!jsonLd) {
      this.setJsonLd(null);
      return;
    }
    this.pendingTasks.run(async () => {
      const { jsonLdFor } = await import('./structured-data');
      this.setJsonLd(jsonLdFor(jsonLd));
    });
  }

  private setCanonical(url: string | null) {
    let link = this.document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }

  private setJsonLd(data: object | null) {
    const selector = 'script[type="application/ld+json"][data-seo]';
    let script = this.document.head.querySelector<HTMLScriptElement>(selector);
    if (!data) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', '');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
