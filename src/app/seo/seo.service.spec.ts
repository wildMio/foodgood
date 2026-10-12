import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SeoService } from './seo.service';
import { jsonLdFor, menuJsonLd, restaurantJsonLd } from './structured-data';
import { goose } from '../../assets/data/goose';
import { store } from '../../assets/data/store';

describe('SeoService', () => {
  let service: SeoService;
  let head: HTMLHeadElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    head = TestBed.inject(DOCUMENT).head;
  });

  const content = (selector: string) =>
    head.querySelector(selector)?.getAttribute('content');

  it('should set description, canonical and og tags per page', () => {
    service.update('鵝香鵝肉餐廳｜菜單', '/menu', { description: '完整菜單' });

    expect(content('meta[name="description"]')).toBe('完整菜單');
    expect(content('meta[property="og:url"]')).toBe(`${store.siteUrl}/menu`);
    expect(content('meta[property="og:title"]')).toBe('鵝香鵝肉餐廳｜菜單');
    expect(
      head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href
    ).toBe(`${store.siteUrl}/menu`);
    expect(head.querySelector('meta[name="robots"]')).toBeNull();
    expect(content('meta[property="og:image"]')).toBe(
      `${store.siteUrl}${store.ogImage}`
    );
  });

  it('should drop structured data on pages without it', () => {
    head.insertAdjacentHTML(
      'beforeend',
      '<script type="application/ld+json" data-seo>{}</script>'
    );
    service.update('找不到頁面｜鵝香鵝肉餐廳', '/nope', { noindex: true });
    expect(head.querySelector('script[data-seo]')).toBeNull();
  });

  it('should mark noindex pages and drop canonical', () => {
    service.update('鵝香鵝肉餐廳｜找不到頁面', '/nope', { noindex: true });

    expect(content('meta[name="robots"]')).toBe('noindex');
    expect(head.querySelector('link[rel="canonical"]')).toBeNull();
  });
});

describe('structured data', () => {
  it('should describe the restaurant with address and hours', () => {
    const data = restaurantJsonLd();
    expect(data['@type']).toBe('Restaurant');
    expect(data.address.streetAddress).toBe('中山路555號');
    expect(data.openingHoursSpecification.length).toBe(store.hours.length);
    expect(data.sameAs).toEqual([store.mapsPlaceUrl]);
  });

  it('should output WebSite and Restaurant only on home', () => {
    const types = (page: 'home' | 'menu' | 'collection') =>
      jsonLdFor(page)['@graph'].map((node) => node['@type']);

    expect(jsonLdFor('home')['@context']).toBe('https://schema.org');
    expect(types('home')).toEqual(['WebSite', 'Restaurant']);
    expect(types('menu')).toEqual(['Menu']);
    expect(types('collection')).toEqual(['Menu']);
  });

  it('should include every menu item with TWD offers', () => {
    type Item = {
      name: string;
      offers?: { price: string; priceCurrency: string; name?: string }[];
    };
    const sections: { hasMenuItem: Item[] }[] = menuJsonLd().hasMenuSection;
    const items = sections.flatMap((section) => section.hasMenuItem);
    const total = goose.classifies.reduce(
      (sum, classify) => sum + classify.items.length,
      1 // 招牌鵝肉
    );
    expect(items.length).toBe(total);

    const ginger = items.find((item) => item.name === '薑絲大腸')!;
    expect(ginger.offers).toEqual([
      { '@type': 'Offer', name: '小', price: '200', priceCurrency: 'TWD' },
      { '@type': 'Offer', name: '大', price: '300', priceCurrency: 'TWD' },
    ]);
  });
});
