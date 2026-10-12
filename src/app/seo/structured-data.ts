import { goose, gooseCollection } from '../../assets/data/goose';
import { store } from '../../assets/data/store';

const url = (path: string) => `${store.siteUrl}${path}`;

const context = 'https://schema.org';

/** 網站（WebSite）：影響 Google 搜尋結果顯示的網站名稱 */
export function websiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': url('/#website'),
    name: store.name,
    alternateName: ['鵝香鵝肉', '鵝香鵝肉店'],
    url: url('/'),
    inLanguage: 'zh-Hant-TW',
  };
}

/** 店家（Restaurant）：只放在呈現店家資訊的首頁 */
export function restaurantJsonLd() {
  return {
    '@type': 'Restaurant',
    '@id': url('/#restaurant'),
    name: store.name,
    description: store.intro[0],
    url: url('/'),
    image: url(store.ogImage),
    logo: url('/icon-512.png'),
    telephone: '+886-3-497-0458',
    servesCuisine: ['客家菜', '台式熱炒', '鵝肉'],
    priceRange: '$$',
    acceptsReservations: true,
    hasMenu: url('/menu'),
    hasMap: store.mapUrl,
    // 與 Google 商家檔案建立同一實體的關聯
    sameAs: [store.mapsPlaceUrl],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '中山路555號',
      addressLocality: '新屋區',
      addressRegion: '桃園市',
      postalCode: store.postalCode,
      addressCountry: 'TW',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: store.geo.lat,
      longitude: store.geo.lng,
    },
    openingHoursSpecification: store.hours.map(({ open, close }) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: open,
      closes: close,
    })),
  };
}

const offer = (price: string | number, name?: string) => ({
  '@type': 'Offer',
  ...(name ? { name } : {}),
  price: String(price),
  priceCurrency: 'TWD',
});

/** 單點菜單（/menu） */
export function menuJsonLd() {
  return {
    '@type': 'Menu',
    '@id': url('/menu#menu'),
    name: `${store.name}菜單`,
    url: url('/menu'),
    inLanguage: 'zh-Hant-TW',
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: '招牌',
        hasMenuItem: [
          {
            '@type': 'MenuItem',
            name: '招牌鵝肉',
            description: '每日現切白斬鵝肉，時價',
          },
        ],
      },
      ...goose.classifies.map((classify) => ({
        '@type': 'MenuSection',
        name: classify.label,
        hasMenuItem: classify.items.map((item) => ({
          '@type': 'MenuItem',
          name: item.label,
          offers: item.tags
            .map((tag, index) => ({
              ...tag,
              size: classify.tags[index]?.label,
            }))
            .filter((tag) => tag.value)
            .map((tag) => offer(tag.value, tag.size || undefined)),
        })),
      })),
    ],
  };
}

/** 合菜（/menu-collection） */
export function collectionJsonLd() {
  return {
    '@type': 'Menu',
    '@id': url('/menu-collection#menu'),
    name: `${store.name}精選合菜`,
    url: url('/menu-collection'),
    inLanguage: 'zh-Hant-TW',
    hasMenuSection: {
      '@type': 'MenuSection',
      name: '合菜',
      hasMenuItem: gooseCollection.map((collection) => ({
        '@type': 'MenuItem',
        name: `${Number(collection.label).toLocaleString('zh-TW')} 元合菜`,
        description: collection.items.map((item) => item.trim()).join('、'),
        offers: offer(collection.label),
      })),
    },
  };
}

export type JsonLdPage = 'home' | 'menu' | 'collection';

/** 依頁面組成單一 JSON-LD（@graph） */
export function jsonLdFor(page: JsonLdPage) {
  const graph = {
    home: () => [websiteJsonLd(), restaurantJsonLd()],
    menu: () => [menuJsonLd()],
    collection: () => [collectionJsonLd()],
  }[page]();
  return { '@context': context, '@graph': graph };
}
