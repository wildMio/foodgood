import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  @HostBinding('class') class = 'app-checkbox inline-flex relative ';

  @Input() checked = false;

  @Input() disabled = false;

  @Input() tabindex: number | string = 0;

  @Output() checkedChange = new EventEmitter<boolean>();

  changeValue(value: boolean) {
    this.checkedChange.emit(value);
  }
}
