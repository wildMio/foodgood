import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCollectionComponent } from './menu-collection.component';

describe('MenuCollectionComponent', () => {
  let component: MenuCollectionComponent;
  let fixture: ComponentFixture<MenuCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MenuCollectionComponent]
    });
    fixture = TestBed.createComponent(MenuCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
