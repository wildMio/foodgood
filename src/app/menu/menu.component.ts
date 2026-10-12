import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

import { goose } from '../../assets/data/goose';
import { IconComponent } from '../component/icon/icon.component';
import { CheckoutDialogComponent } from '../checkout-dialog/checkout-dialog.component';
import { OverlayService } from '../service/overlay.service';
import { ShoppingCartService } from '../service/shopping-cart.service';

interface Price {
  key: string;
  size: string;
  value: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class MenuComponent {
  cart = inject(ShoppingCartService);
  overlayService = inject(OverlayService);

  mainProduct = { label: '招牌鵝肉' };

  // 每個品項固定兩個價格欄位（小／大），只有單一價格時靠右對齊
  classifies = goose.classifies.map((classify, index) => {
    const sizes = classify.tags.map((tag) => tag.label);
    const offset = 2 - sizes.length;
    return {
      id: `category-${index}`,
      label: classify.label,
      sizes: [...Array(offset).fill(''), ...sizes],
      items: classify.items.map((item) => ({
        label: item.label,
        prices: [
          ...Array(offset).fill(null),
          ...item.tags.map((tag, i): Price | null =>
            tag.value
              ? {
                  key: ShoppingCartService.key(item.label, tag.value),
                  size: sizes[i],
                  value: tag.value,
                }
              : null
          ),
        ] as (Price | null)[],
      })),
    };
  });

  activeId = signal(this.classifies[0].id);

  chipBar = viewChild.required<ElementRef<HTMLElement>>('chipBar');
  sections = viewChildren<ElementRef<HTMLElement>>('section');
  pageEnd = viewChild.required<ElementRef<HTMLElement>>('pageEnd');

  constructor() {
    const destroyRef = inject(DestroyRef);

    // 依捲動位置標示目前分類
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.find((entry) => entry.isIntersecting);
          if (visible && !this.isLocked()) {
            this.setActive(visible.target.id);
          }
        },
        { rootMargin: '-120px 0px -70% 0px' }
      );
      this.sections().forEach(({ nativeElement }) =>
        observer.observe(nativeElement)
      );

      // 最後一個分類高度不足以捲到頂端，捲到底時直接標示
      const endObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.isLocked()) {
            this.setActive(this.classifies[this.classifies.length - 1].id);
          }
        },
        { threshold: 1 }
      );
      endObserver.observe(this.pageEnd().nativeElement);

      destroyRef.onDestroy(() => {
        observer.disconnect();
        endObserver.disconnect();
      });
    });
  }

  /** 點擊分類後的平滑捲動期間，暫停捲動偵測以免標示跳動 */
  private lockUntil = 0;

  private isLocked() {
    return Date.now() < this.lockUntil;
  }

  setActive(id: string) {
    this.activeId.set(id);
    const bar = this.chipBar().nativeElement;
    const chip = bar.querySelector<HTMLElement>(`[data-target="${id}"]`);
    if (chip) {
      bar.scrollTo({
        left: chip.offsetLeft - (bar.clientWidth - chip.clientWidth) / 2,
        behavior: 'smooth',
      });
    }
  }

  scrollTo(id: string) {
    this.setActive(id);
    this.lockUntil = Date.now() + 1000;
    this.sections()
      .find(({ nativeElement }) => nativeElement.id === id)
      ?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  togglePrice(label: string, price: Price) {
    this.cart.toggle({ label, tag: price.size, value: price.value });
  }

  openCart() {
    this.overlayService.open(CheckoutDialogComponent);
  }
}
