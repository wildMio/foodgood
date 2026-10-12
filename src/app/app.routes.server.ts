import { RenderMode, ServerRoute } from '@angular/ssr';

// 公開頁面於建置時預先渲染成靜態 HTML，供搜尋引擎與社群預覽讀取；
// 內部工具與 404 維持純前端渲染（由 Firebase Hosting 設定處理）。
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'menu', renderMode: RenderMode.Prerender },
  { path: 'menu-collection', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
