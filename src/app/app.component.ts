import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  AsyncPipe,
  NgTemplateOutlet,
  isPlatformBrowser,
} from '@angular/common';
import {
  IsActiveMatchOptions,
  NavigationEnd,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { IconComponent } from './component/icon/icon.component';
import { ShoppingCartService } from './service/shopping-cart.service';
import { store } from '../assets/data/store';

type Theme = 'system' | 'light' | 'dark';

const exactMatch: IsActiveMatchOptions = {
  paths: 'exact',
  fragment: 'exact',
  queryParams: 'ignored',
  matrixParams: 'ignored',
};

function readTheme(): Theme {
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark' || theme === 'system') {
      return theme;
    }
    // 舊版設定相容
    const lightMode = localStorage.getItem('lightMode');
    return lightMode === null
      ? 'system'
      : lightMode === 'true'
        ? 'light'
        : 'dark';
  } catch {
    return 'system';
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    IconComponent,
  ],
})
export class AppComponent implements OnInit {
  router = inject(Router);
  cart = inject(ShoppingCartService);
  destroyRef = inject(DestroyRef);
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  mainEl = viewChild.required<ElementRef<HTMLElement>>('mainEl');

  storeName = store.name;

  navItems = [
    {
      label: '首頁',
      icon: 'home',
      link: '/',
      fragment: undefined,
      match: exactMatch,
    },
    {
      label: '菜單',
      icon: 'restaurant',
      link: '/menu',
      fragment: undefined,
      match: { ...exactMatch, paths: 'subset' } as IsActiveMatchOptions,
    },
    {
      label: '合菜',
      icon: 'playlist-add-check-circle',
      link: '/menu-collection',
      fragment: undefined,
      match: { ...exactMatch, paths: 'subset' } as IsActiveMatchOptions,
    },
    {
      label: '店家資訊',
      icon: 'location',
      link: '/',
      fragment: 'info',
      match: exactMatch,
    },
  ];

  themes: { value: Theme; label: string }[] = [
    { value: 'system', label: '跟隨系統' },
    { value: 'light', label: '淺色' },
    { value: 'dark', label: '深色' },
  ];

  fontSizes = [
    { value: 16, label: '小' },
    { value: 20, label: '中' },
    { value: 24, label: '大' },
  ];

  // 預先渲染時使用預設值；實際設定由 index.html 內嵌腳本先套用，避免閃爍
  theme = signal<Theme>(this.isBrowser ? readTheme() : 'system');

  fontSize = signal<number>(
    (this.isBrowser && Number(localStorage.getItem('fontSize'))) || 16
  );

  private prefersLight = signal(
    this.isBrowser && matchMedia('(prefers-color-scheme: light)').matches
  );

  loadModuleIndicator$ = this.router.events.pipe(
    filter(
      (event) =>
        event instanceof RouteConfigLoadStart ||
        event instanceof RouteConfigLoadEnd
    ),
    map((event) => event instanceof RouteConfigLoadStart)
  );

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    effect(() => {
      const theme = this.theme();
      const light =
        theme === 'light' || (theme === 'system' && this.prefersLight());
      document.body.classList.toggle('light-mode', light);
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', light ? '#ebebeb' : '#000000');
      localStorage.setItem('theme', theme);
      localStorage.removeItem('lightMode');
    });

    effect(() => {
      const size = this.fontSize();
      document.documentElement.style.fontSize = `${size}px`;
      localStorage.setItem('fontSize', JSON.stringify(size));
    });
  }

  /** 點擊目前所在頁面的導覽項目時，捲回頂端或捲到對應區塊 */
  onNavClick(link: string, fragment?: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([link], { fragment })
    );
    if (this.router.url !== url) {
      return;
    }
    if (fragment) {
      document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.mainEl().nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    const media = matchMedia('(prefers-color-scheme: light)');
    const onChange = (event: MediaQueryListEvent) =>
      this.prefersLight.set(event.matches);
    media.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() =>
      media.removeEventListener('change', onChange)
    );

    // 頁面捲動容器為 <main>，換頁時需自行回到頂端（錨點交由頁面處理）
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        filter((event) => !event.urlAfterRedirects.includes('#'))
      )
      .subscribe(() => this.mainEl().nativeElement.scrollTo({ top: 0 }));
  }
}
