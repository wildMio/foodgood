import {
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  OnInit,
  createComponent,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, fromEvent, map, take } from 'rxjs';
import { OverlayService } from './service/overlay.service';
import { IconComponent } from './component/icon/icon.component';
import { CheckoutDialogComponent } from './checkout-dialog/checkout-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    IconComponent,
  ],
})
export class AppComponent implements OnInit {
  overlayService = inject(OverlayService);
  router = inject(Router);

  navExpanded = false;

  environmentInjector = inject(EnvironmentInjector);

  fontSize: number = JSON.parse(localStorage.getItem('fontSize') ?? '16');

  lightMode: boolean = JSON.parse(localStorage.getItem('lightMode') ?? 'false');

  loadModuleIndicator$ = this.router.events.pipe(
    filter(
      (event) =>
        event instanceof RouteConfigLoadStart ||
        event instanceof RouteConfigLoadEnd
    ),
    map((event) => event instanceof RouteConfigLoadStart)
  );

  ngOnInit(): void {
    document.body.classList.toggle('light-mode', this.lightMode);
    document.documentElement.style.fontSize = `${this.fontSize}px`;
  }

  openNav(navEl: HTMLElement, focusEl: HTMLButtonElement) {
    if (this.navExpanded) {
      return;
    }
    this.navExpanded = true;
    navEl.classList.remove('hidden');
    requestAnimationFrame(() => {
      navEl.toggleAttribute('data-visible');
    });
    focusEl.focus();
  }

  closeNav(navEl: HTMLElement, focusEl: HTMLButtonElement) {
    if (!this.navExpanded) {
      return;
    }
    focusEl.focus();
    this.navExpanded = false;
    navEl.toggleAttribute('data-visible');
    fromEvent(navEl, 'transitionend')
      .pipe(take(1))
      .subscribe({
        next: () => {
          navEl.classList.add('hidden');
        },
      });
  }

  openCheckout() {
    const componentRef = createComponent(CheckoutDialogComponent, {
      environmentInjector: this.environmentInjector,
    });

    this.overlayService.attach(componentRef);
  }

  toggleTheme() {
    this.lightMode = !this.lightMode;
    localStorage.setItem('lightMode', JSON.stringify(this.lightMode));
    document.body.classList.toggle('light-mode', this.lightMode);
  }

  changeFontSize(size: number) {
    this.fontSize = size;
    localStorage.setItem('fontSize', JSON.stringify(size));
    document.documentElement.style.fontSize = `${size}px`;
  }
}
