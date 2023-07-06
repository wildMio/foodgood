import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gooseCollection } from 'src/assets/data/goose';
import { IconComponent } from '../component/icon/icon.component';

@Component({
  selector: 'app-menu-collection',
  standalone: true,
  templateUrl: './menu-collection.component.html',
  styleUrls: ['./menu-collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class MenuCollectionComponent {
  classifies = gooseCollection;

  mode: 'row' | 'col' = 'row';
}
