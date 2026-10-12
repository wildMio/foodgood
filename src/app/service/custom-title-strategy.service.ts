import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';
import { store } from '../../assets/data/store';
import { SeoData, SeoService } from '../seo/seo.service';

/** 換頁時更新標題與 SEO 中繼資料（預先渲染時也會執行並寫入 HTML） */
@Injectable({
  providedIn: 'root',
})
export class CustomTitleStrategyService extends TitleStrategy {
  title = inject(Title);
  seo = inject(SeoService);

  updateTitle(snapshot: RouterStateSnapshot): void {
    // 內頁以頁面關鍵字開頭、品牌名稱結尾；已含品牌名稱（首頁）則直接使用
    const pageTitle = this.buildTitle(snapshot);
    const title = !pageTitle
      ? store.name
      : pageTitle.includes(store.name)
        ? pageTitle
        : `${pageTitle}｜${store.name}`;
    this.title.setTitle(title);

    let route: ActivatedRouteSnapshot = snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const path = snapshot.url.split(/[?#]/)[0];
    this.seo.update(title, path, route.data['seo'] ?? {});
  }
}
