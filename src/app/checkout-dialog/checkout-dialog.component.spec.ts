import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutDialogComponent } from './checkout-dialog.component';

describe('CheckoutDialogComponent', () => {
  let component: CheckoutDialogComponent;
  let fixture: ComponentFixture<CheckoutDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckoutDialogComponent]
    });
    fixture = TestBed.createComponent(CheckoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
