import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { goose, gooseCollection } from '../../assets/data/goose';
import { BusinessPeriod, store } from '../../assets/data/store';
import { IconComponent } from '../component/icon/icon.component';

const toMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

/** 依台灣時間判斷目前是否營業，並回傳下一個時間點的提示 */
export function getOpenStatus(hours: BusinessPeriod[], now = new Date()) {
  const [hour, minute] = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
    .format(now)
    .split(':')
    .map(Number);
  const current = hour * 60 + minute;

  const period = hours.find(
    ({ open, close }) =>
      current >= toMinutes(open) && current < toMinutes(close)
  );
  if (period) {
    return { open: true, label: '營業中', hint: `${period.close} 休息` };
  }
  const next = hours.find(({ open }) => current < toMinutes(open));
  return {
    open: false,
    label: '休息中',
    hint: next ? `${next.open} 開始營業` : `明日 ${hours[0].open} 開始營業`,
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
})
export class HomeComponent {
  route = inject(ActivatedRoute);
  elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  destroyRef = inject(DestroyRef);

  store = store;

  year = new Date().getFullYear();

  // 網址為固定常數，可安全略過 resource URL 檢查
  mapEmbedUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    store.mapEmbedUrl
  );

  // 營業狀態取決於當下時間，只在瀏覽器計算（預先渲染時不輸出）
  status = signal<ReturnType<typeof getOpenStatus> | null>(null);

  // Google 地圖約 450 KB，接近店家資訊區塊時才載入
  showMap = signal(false);

  hoursText = store.hours
    .map(({ open, close }) => `${open}–${close}`)
    .join('、');

  signatures = store.signatures.flatMap(({ label, text }) => {
    for (const classify of goose.classifies) {
      const item = classify.items.find((item) => item.label === label);
      if (item) {
        const prices = item.tags
          .map((tag, index) => ({
            size: classify.tags[index]?.label ?? '',
            value: tag.value,
          }))
          .filter(({ value }) => value);
        const priceText = prices
          .map(({ size, value }) => `${size ? `${size} ` : ''}$${value}`)
          .join('／');
        return [{ label, text, priceText }];
      }
    }
    return [];
  });

  collections = gooseCollection.map((collection) => ({
    price: Number(collection.label).toLocaleString('zh-TW'),
    count: collection.items.length,
  }));

  constructor() {
    // 僅在瀏覽器執行：計算營業狀態、處理錨點捲動（頁面捲動容器為 <main>）
    afterNextRender(() => {
      this.status.set(getOpenStatus(store.hours));

      const info = this.elementRef.nativeElement.querySelector('#info');
      if (info) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              this.showMap.set(true);
              observer.disconnect();
            }
          },
          { rootMargin: '300px 0px' }
        );
        observer.observe(info);
        this.destroyRef.onDestroy(() => observer.disconnect());
      }
      this.route.fragment
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((fragment) => {
          if (fragment) {
            this.elementRef.nativeElement
              .querySelector(`#${CSS.escape(fragment)}`)
              ?.scrollIntoView({ behavior: 'smooth' });
          }
        });
    });
  }
}
