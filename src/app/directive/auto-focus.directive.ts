import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    this.host.nativeElement.focus();
  }
}
