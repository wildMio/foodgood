import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeComponent, getOpenStatus } from './home.component';
import { store } from '../../assets/data/store';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render address and phone link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(store.address);
    expect(compiled.querySelector(`a[href="${store.phoneHref}"]`)).toBeTruthy();
  });

  it('should resolve every signature dish from menu data', () => {
    expect(component.signatures.length).toBe(store.signatures.length);
    expect(component.signatures[0].priceText).toMatch(/\$\d+/);
  });
});

describe('getOpenStatus', () => {
  const hours = [
    { open: '11:00', close: '14:00' },
    { open: '16:30', close: '20:00' },
  ];
  // 台灣時間 = UTC+8
  const taipei = (time: string) => new Date(`2026-10-09T${time}:00+08:00`);

  it('should be open during business hours', () => {
    expect(getOpenStatus(hours, taipei('12:00'))).toEqual({
      open: true,
      label: '營業中',
      hint: '14:00 休息',
    });
  });

  it('should show next opening time during break', () => {
    expect(getOpenStatus(hours, taipei('15:00')).hint).toBe('16:30 開始營業');
  });

  it('should show tomorrow opening time after closing', () => {
    const status = getOpenStatus(hours, taipei('21:00'));
    expect(status.open).toBe(false);
    expect(status.hint).toBe('明日 11:00 開始營業');
  });
});
