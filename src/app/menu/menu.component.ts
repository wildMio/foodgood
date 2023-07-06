import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { goose } from 'src/assets/data/goose';
import { IconComponent } from '../component/icon/icon.component';
import { CheckboxComponent } from '../component/checkbox/checkbox.component';
import { ShoppingCartService } from '../service/shopping-cart.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, CheckboxComponent],
})
export class MenuComponent {
  shoppingCartService = inject(ShoppingCartService);

  selectedItems = this.shoppingCartService.selectedItems;

  data = goose;

  classifies = goose.classifies.map((classify) => ({
    ...classify,
    labelCharacters: [...classify.label],
    items: classify.items.map((item) => ({
      ...item,
      labelCharacters: [...item.label],
      checks: item.tags.map((tag) =>
        this.selectedItems.has(`${item.label}-${tag.value}`)
      ),
    })),
  }));

  mainProductCheck = !!this.shoppingCartService.mainProduct;

  checkItem(label: string, tag: string, value: string, check: boolean) {
    const key = `${label}-${value}`;
    if (check) {
      this.selectedItems.set(key, { label, tag, value });
    } else {
      this.selectedItems.delete(key);
    }
  }

  updateMainProduct(check: boolean) {
    this.shoppingCartService.updateMainProduct(
      check ? { label: '招牌鵝肉' } : null
    );
  }
}
