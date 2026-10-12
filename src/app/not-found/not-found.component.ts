import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page grid gap-16 place-items-center text-center">
      <h1 class="page-title">找不到這個頁面</h1>
      <p class="muted">網址可能已變更或輸入有誤。</p>
      <div class="flex flex-wrap justify-center gap-8">
        <a class="cta cta-primary" routerLink="/menu">查看菜單</a>
        <a class="cta" routerLink="/">回到首頁</a>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding-block: var(--size-900);
    }
  `,
})
export class NotFoundComponent {}
