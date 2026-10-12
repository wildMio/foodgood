import { TestBed } from '@angular/core/testing';

import { ShoppingCartService } from './shopping-cart.service';

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;
  const item = { label: '薑絲大腸', tag: '小', value: '200' };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingCartService);
  });

  it('should toggle items and compute count and total', () => {
    service.toggle(item);
    service.toggle({ label: '糖醋排骨', tag: '大', value: '300' });
    expect(service.count()).toBe(2);
    expect(service.total()).toBe(500);

    service.toggle(item);
    expect(service.count()).toBe(1);
    expect(service.total()).toBe(300);
  });

  it('should count main product without adding to total', () => {
    service.toggleMainProduct({ label: '招牌鵝肉' });
    expect(service.count()).toBe(1);
    expect(service.total()).toBe(0);
  });

  it('should persist selection to localStorage after restore', () => {
    TestBed.tick();
    service.toggle(item);
    service.toggleMainProduct({ label: '招牌鵝肉' });
    TestBed.tick();
    expect(JSON.parse(localStorage.getItem('selectedItems')!)).toEqual([
      ['薑絲大腸-200', item],
    ]);
    expect(localStorage.getItem('mainProduct')).toContain('招牌鵝肉');
  });

  it('should merge stored items with changes made before restore', () => {
    const stored = { label: '糖醋排骨', tag: '大', value: '300' };
    localStorage.setItem(
      'selectedItems',
      JSON.stringify([['糖醋排骨-300', stored]])
    );
    service.toggle(item);
    TestBed.tick();
    expect(service.count()).toBe(2);
    expect(JSON.parse(localStorage.getItem('selectedItems')!).length).toBe(2);
  });

  it('should clear everything', () => {
    service.toggle(item);
    service.toggleMainProduct({ label: '招牌鵝肉' });
    service.clear();
    expect(service.count()).toBe(0);
  });
});
