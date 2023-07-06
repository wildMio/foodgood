import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCreateComponent } from './menu-create.component';

describe('MenuCreateComponent', () => {
  let component: MenuCreateComponent;
  let fixture: ComponentFixture<MenuCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MenuCreateComponent]
    });
    fixture = TestBed.createComponent(MenuCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
