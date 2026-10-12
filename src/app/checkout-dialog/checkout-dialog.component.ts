import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { OverlayService } from '../service/overlay.service';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { IconComponent } from '../component/icon/icon.component';

type SortType = 'choice' | 'name' | 'price';

type Sort = 'asc' | 'desc';

const collator = new Intl.Collator('zh-Hant');

@Component({
  selector: 'app-checkout-dialog',
  templateUrl: './checkout-dialog.component.html',
  styleUrls: ['./checkout-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink],
})
export class CheckoutDialogComponent {
  overlayService = inject(OverlayService);

  cart = inject(ShoppingCartService);

  dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  sortOptions: { type: SortType; label: string }[] = [
    { type: 'choice', label: '加入順序' },
    { type: 'name', label: '品名' },
    { type: 'price', label: '價格' },
  ];

  sortType = signal<SortType>('choice');

  sort = signal<Sort>('asc');

  items = computed(() => {
    const result = [...this.cart.items().entries()].map(([key, item]) => ({
      key,
      ...item,
    }));
    if (this.sortType() === 'name') {
      result.sort((a, b) => collator.compare(a.label, b.label));
    }
    if (this.sortType() === 'price') {
      result.sort((a, b) => Number(a.value) - Number(b.value));
    }
    return this.sort() === 'desc' ? result.reverse() : result;
  });

  constructor() {
    afterNextRender(() => this.dialog().nativeElement.showModal());
  }

  changeSort(type: SortType) {
    if (type === this.sortType()) {
      this.sort.update((sort) => (sort === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortType.set(type);
      this.sort.set('asc');
    }
  }

  /** 點擊 dialog 本身（即 ::backdrop 區域）時關閉 */
  closeOnBackdrop(event: MouseEvent) {
    if (event.target === this.dialog().nativeElement) {
      this.dialog().nativeElement.close();
    }
  }

  onClose() {
    this.overlayService.close();
  }
}
