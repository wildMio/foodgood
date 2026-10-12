import {
  Injectable,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  label: string;
  tag: string;
  value: string;
}

export interface MainProduct {
  label: string;
}

function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '') ?? fallback;
  } catch {
    return fallback;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  readonly items = signal(new Map<string, CartItem>());

  readonly mainProduct = signal<MainProduct | null>(null);

  /** 已從 localStorage 載入；載入前不寫回，避免覆蓋既有資料 */
  private readonly restored = signal(false);

  readonly count = computed(
    () => this.items().size + (this.mainProduct() ? 1 : 0)
  );

  readonly total = computed(() =>
    [...this.items().values()].reduce(
      (sum, item) => sum + Number(item.value),
      0
    )
  );

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }

    // 於 hydration 完成後才還原，確保與預先渲染的 HTML 一致；
    // 與還原前已發生的操作合併（例如 hydration 期間重播的點擊），不覆蓋
    afterNextRender(() => {
      const stored = read<[string, CartItem][]>('selectedItems', []);
      this.items.update((current) => new Map([...stored, ...current]));
      this.mainProduct.update(
        (current) => current ?? read<MainProduct | null>('mainProduct', null)
      );
      this.restored.set(true);
    });

    effect(() => {
      if (!this.restored()) {
        return;
      }
      localStorage.setItem(
        'selectedItems',
        JSON.stringify([...this.items().entries()])
      );
    });
    effect(() => {
      if (!this.restored()) {
        return;
      }
      const product = this.mainProduct();
      if (product) {
        localStorage.setItem('mainProduct', JSON.stringify(product));
      } else {
        localStorage.removeItem('mainProduct');
      }
    });
  }

  static key(label: string, value: string) {
    return `${label}-${value}`;
  }

  has(key: string) {
    return this.items().has(key);
  }

  toggle(item: CartItem) {
    const key = ShoppingCartService.key(item.label, item.value);
    this.items.update((items) => {
      const next = new Map(items);
      if (!next.delete(key)) {
        next.set(key, item);
      }
      return next;
    });
  }

  remove(key: string) {
    this.items.update((items) => {
      const next = new Map(items);
      next.delete(key);
      return next;
    });
  }

  toggleMainProduct(product: MainProduct) {
    this.mainProduct.update((current) => (current ? null : product));
  }

  clear() {
    this.items.set(new Map());
    this.mainProduct.set(null);
  }
}
