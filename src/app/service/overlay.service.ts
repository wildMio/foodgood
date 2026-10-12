import {
  ApplicationRef,
  ComponentRef,
  DOCUMENT,
  Injectable,
  Type,
  createComponent,
  inject,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private componentRef?: ComponentRef<unknown> | null;
  private previousActiveElement?: HTMLElement;

  open<T>(component: Type<T>) {
    if (this.componentRef) {
      return;
    }

    this.previousActiveElement = this.document.activeElement as HTMLElement;

    this.componentRef = createComponent(component, {
      environmentInjector: this.appRef.injector,
    });
    this.appRef.attachView(this.componentRef.hostView);
    this.document.body.appendChild(this.componentRef.location.nativeElement);
  }

  close() {
    if (!this.componentRef) {
      return;
    }
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
    this.componentRef = null;

    this.previousActiveElement?.focus();
  }
}
