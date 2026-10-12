import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaySubject, map } from 'rxjs';
import { InputTo$ } from '../../util/input-to-observable';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  svgIcon$ = new ReplaySubject(1);
  @InputTo$()
  @Input()
  svgIcon?: string;

  href$ = this.svgIcon$.pipe(
    map((svgIcon) => `/assets/icon/sprite.svg#${svgIcon}`)
  );
}
