import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  selectedItems = new Map<
    string,
    { label: string; tag: string; value: string }
  >(JSON.parse(localStorage.getItem('selectedItems') ?? '[]'));

  mainProduct?: { label: string } | null = JSON.parse(
    localStorage.getItem('mainProduct') ?? 'null'
  );

  saveSelectedItems() {
    localStorage.setItem(
      'selectedItems',
      JSON.stringify([...this.selectedItems.entries()])
    );
  }

  updateMainProduct(product: { label: string } | null) {
    this.mainProduct = product;
    if (product) {
      localStorage.setItem('mainProduct', JSON.stringify(product));
    } else {
      localStorage.removeItem('mainProduct');
    }
  }
}
