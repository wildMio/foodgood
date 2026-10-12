import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { ShoppingCartService } from '../service/shopping-cart.service';

describe('MenuComponent', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [MenuComponent],
    });
    fixture = TestBed.createComponent(MenuComponent);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should render readable item names and category chips', () => {
    expect(element.querySelector('.menu-name')?.textContent?.trim()).toBe(
      '薑絲大腸'
    );
    expect(element.querySelectorAll('.chip').length).toBe(
      fixture.componentInstance.classifies.length
    );
  });

  it('should add item when price is clicked and show summary bar', async () => {
    expect(element.querySelector('.summary')).toBeNull();

    const price = element.querySelector<HTMLButtonElement>(
      '.menu-row .price-toggle'
    )!;
    price.click();
    await fixture.whenStable();

    expect(price.getAttribute('aria-pressed')).toBe('true');
    expect(TestBed.inject(ShoppingCartService).count()).toBe(1);
    expect(element.querySelector('.summary')?.textContent).toContain('$200');
  });
});
