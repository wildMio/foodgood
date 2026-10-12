export interface BusinessPeriod {
  open: string;
  close: string;
}

const name = '鵝香鵝肉餐廳';
const address = '桃園市新屋區中山路555號';

export const store = {
  name,
  // 正式網址：canonical、Open Graph、結構化資料、robots.txt、sitemap.xml 皆由此產生，更換網域只需改這裡
  siteUrl: 'https://foodgood-c130c.web.app',
  ogImage: '/og-image.png',
  shortName: '鵝香',
  slogan: '新屋在地的客家鵝肉與合菜',
  intro: [
    '鵝香鵝肉餐廳位於桃園新屋中山路上，以白斬鵝肉為招牌，鵝肉現切上桌，搭配特調醬料，是許多在地人與過路客必點的一盤。',
    '除了鵝肉，店內也供應道地客家菜、熱炒、海鮮、湯品與多種價位的合菜桌菜。份量實在、價格親民，不論是家常便飯、家庭聚餐或宴客都很適合。',
  ],
  address,
  postalCode: '327',
  phone: '03-497-0458',
  phoneHref: 'tel:+88634970458',
  geo: { lat: 24.973437, lng: 121.0968706 },
  mapUrl: 'https://maps.app.goo.gl/QfqAhCEhJCpKEebUA',
  // Google 地圖地點的固定網址（CID），供結構化資料 sameAs 連結商家檔案
  mapsPlaceUrl: 'https://www.google.com/maps?cid=13171190374817857094',
  mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(
    `${name} ${address}`
  )}&hl=zh-TW&z=16&output=embed`,
  // 每日營業時段（台灣時間）
  hours: [
    { open: '11:00', close: '14:00' },
    { open: '16:30', close: '20:00' },
  ] as BusinessPeriod[],
  hoursNote: '營業時間如有異動以店家公告為準，建議來電確認或訂位。',
  parking: '門口設有大型停車場，開車前來十分方便。',
  // 推薦菜色，名稱需對應 goose.ts 中的品項
  signatures: [
    { label: '薑絲大腸', text: '薑絲酸香開胃，大腸軟嫩不腥。' },
    { label: '糖醋排骨', text: '醬汁濃郁、酸甜適中，大人小孩都愛。' },
    { label: '酥炸肥腸', text: '外酥內嫩，椒鹽調味，下酒良伴。' },
    { label: '豆酥鱈魚', text: '鱈魚滑嫩，豆酥香脆，份量大方。' },
    { label: '湯圓', text: '客家鹹湯圓，湯頭清甜，料多實在。' },
    { label: '酸菜肚片湯', text: '酸菜爽口、肚片脆嫩，暖胃首選。' },
  ],
};
