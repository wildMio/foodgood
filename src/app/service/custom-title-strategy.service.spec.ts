import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, TitleStrategy, provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { CustomTitleStrategyService } from './custom-title-strategy.service';

@Component({ template: '' })
class BlankComponent {}

describe('CustomTitleStrategyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: '',
            component: BlankComponent,
            title: '鵝香鵝肉餐廳｜首頁標語',
          },
          { path: 'menu', component: BlankComponent, title: '菜單與價格' },
        ]),
        { provide: TitleStrategy, useClass: CustomTitleStrategyService },
      ],
    });
  });

  it('should keep titles that already contain the brand', async () => {
    await TestBed.inject(Router).navigateByUrl('/');
    expect(TestBed.inject(Title).getTitle()).toBe('鵝香鵝肉餐廳｜首頁標語');
  });

  it('should append the brand to page titles', async () => {
    await TestBed.inject(Router).navigateByUrl('/menu');
    expect(TestBed.inject(Title).getTitle()).toBe('菜單與價格｜鵝香鵝肉餐廳');
  });
});
