import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckoutDialogComponent } from './checkout-dialog.component';
import { ShoppingCartService } from '../service/shopping-cart.service';

describe('CheckoutDialogComponent', () => {
  let fixture: ComponentFixture<CheckoutDialogComponent>;
  let cart: ShoppingCartService;
  let element: HTMLElement;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [CheckoutDialogComponent],
      providers: [provideRouter([])],
    });
    cart = TestBed.inject(ShoppingCartService);
    fixture = TestBed.createComponent(CheckoutDialogComponent);
    element = fixture.nativeElement;
  });

  it('should show empty state without items', async () => {
    await fixture.whenStable();
    expect(element.textContent).toContain('尚未選擇任何品項');
  });

  it('should list items with total and allow removing', async () => {
    cart.toggle({ label: '薑絲大腸', tag: '小', value: '200' });
    cart.toggle({ label: '糖醋排骨', tag: '大', value: '300' });
    await fixture.whenStable();

    expect(element.querySelectorAll('.sheet-row').length).toBe(2);
    expect(element.querySelector('.total')?.textContent).toContain('$500');

    element.querySelector<HTMLButtonElement>('.sheet-row .remove')!.click();
    await fixture.whenStable();
    expect(element.querySelectorAll('.sheet-row').length).toBe(1);
  });

  it('should sort by price descending on second click', async () => {
    cart.toggle({ label: '糖醋排骨', tag: '大', value: '300' });
    cart.toggle({ label: '薑絲大腸', tag: '小', value: '200' });
    const component = fixture.componentInstance;
    component.changeSort('price');
    expect(component.items().map((item) => item.value)).toEqual(['200', '300']);
    component.changeSort('price');
    expect(component.items().map((item) => item.value)).toEqual(['300', '200']);
  });
});
