import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  inject,
  Injectable,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private readonly document = inject(DOCUMENT);
  overlayContainer = this.document.querySelector('.overlay-container')!;
  appRef = inject(ApplicationRef);
  componentRef?: ComponentRef<any> | null;

  previousActiveElement?: HTMLElement;

  create(element: HTMLElement) {
    this.overlayContainer?.appendChild(element);
  }

  attach<T>(componentRef: ComponentRef<T>) {
    if (this.componentRef) {
      return;
    }

    this.previousActiveElement = this.document.activeElement as HTMLElement;

    this.componentRef = componentRef;
    this.appRef.attachView(componentRef.hostView);

    this.overlayContainer?.appendChild(componentRef.location.nativeElement);
  }

  detach() {
    if (!this.componentRef) {
      return;
    }
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
    this.componentRef = null;

    this.previousActiveElement?.focus();
  }
}
