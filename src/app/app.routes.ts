import { Routes } from '@angular/router';
import { SeoData } from './seo/seo.service';

const seo = (data: SeoData) => ({ seo: data });

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
    title: '鵝香鵝肉餐廳｜桃園新屋客家鵝肉・合菜',
    pathMatch: 'full',
    data: seo({
      jsonLd: 'home',
      description:
        '鵝香鵝肉餐廳位於桃園市新屋區中山路555號，招牌白斬鵝肉、客家菜、熱炒與 3,000–6,000 元合菜，份量實在、價格親民。線上查看菜單、營業時間與交通資訊。',
    }),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./menu/menu.component').then((c) => c.MenuComponent),
    title: '菜單與價格・桃園新屋客家鵝肉',
    data: seo({
      description:
        '鵝香鵝肉餐廳完整菜單與價格：招牌白斬鵝肉、客家菜、熱炒海鮮、酥炸、青菜、湯品與主食，大小份價格一目了然。',
      jsonLd: 'menu',
    }),
  },
  {
    path: 'menu-collection',
    loadComponent: () =>
      import('./menu-collection/menu-collection.component').then(
        (c) => c.MenuCollectionComponent
      ),
    title: '合菜桌菜 3,000–6,000 元',
    data: seo({
      description:
        '鵝香鵝肉餐廳精選合菜：3,000、4,200、5,000、6,000 元四種桌菜內容，適合家庭聚餐與宴客，歡迎來電預訂 03-497-0458。',
      jsonLd: 'collection',
    }),
  },
  {
    path: 'menu-create',
    loadComponent: () =>
      import('./menu-create/menu-create.component').then(
        (c) => c.MenuCreateComponent
      ),
    title: '菜單編輯',
    data: seo({ noindex: true }),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
    title: '找不到頁面',
    data: seo({ noindex: true }),
  },
];
