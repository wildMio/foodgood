import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../service/overlay.service';
import { IconComponent } from '../component/icon/icon.component';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { AutoFocusDirective } from '../directive/auto-focus.directive';

type SortType = 'choice' | 'name' | 'price';

type Sort = 'asc' | 'desc';

@Component({
  selector: 'app-checkout-dialog',
  standalone: true,
  templateUrl: './checkout-dialog.component.html',
  styleUrls: ['./checkout-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, AutoFocusDirective],
})
export class CheckoutDialogComponent {
  overlayService = inject(OverlayService);

  shoppingCartService = inject(ShoppingCartService);

  mainProduct = this.shoppingCartService.mainProduct;

  selectedItems = [...this.shoppingCartService.selectedItems.values()];
  total = this.selectedItems.reduce(
    (acc, item) => acc + parseInt(item.value, 10),
    0
  );

  additionalLabel = this.mainProduct ? '+ 時價' : '';

  sortType: SortType = 'choice';

  sort: Sort = 'asc';

  sortKey = `${this.sortType}-${this.sort}`;

  selectedItemsMap = {
    [`${this.sortKey}`]: [...this.shoppingCartService.selectedItems.values()],
  };

  closeDialog() {
    this.overlayService.detach();
  }

  changeSort(type: SortType) {
    if (type === this.sortType) {
      this.sort = this.sort === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortType = type;
      this.sort = 'asc';
    }

    this.sortKey = `${this.sortType}-${this.sort}`;

    if (!this.selectedItemsMap[`${this.sortKey}`]) {
      const result = [...this.shoppingCartService.selectedItems.values()];
      if (this.sortType === 'name') {
        const collator = new Intl.Collator();
        result.sort((a, b) => collator.compare(a.label, b.label));
      }
      if (this.sortType === 'price') {
        result.sort((a, b) => parseInt(a.value) - parseInt(b.value));
      }
      if (this.sort === 'desc') {
        result.reverse();
      }

      this.selectedItemsMap = {
        ...this.selectedItemsMap,
        [this.sortKey]: result,
      };
    }
  }
}
