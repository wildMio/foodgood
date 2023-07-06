import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayService } from '../service/overlay.service';
import { IconComponent } from '../component/icon/icon.component';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { AutoFocusDirective } from '../directive/auto-focus.directive';

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

  closeDialog() {
    this.overlayService.detach();
  }
}
