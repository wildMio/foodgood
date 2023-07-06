import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  selectedItems = new Map<
    string,
    { label: string; tag: string; value: string }
  >();

  mainProduct?: { label: string } | null;

  updateMainProduct(product: { label: string } | null) {
    this.mainProduct = product;
  }
}
