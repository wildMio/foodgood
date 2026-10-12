import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { gooseCollection } from '../../assets/data/goose';
import { store } from '../../assets/data/store';
import { IconComponent } from '../component/icon/icon.component';

@Component({
  selector: 'app-menu-collection',
  templateUrl: './menu-collection.component.html',
  styleUrls: ['./menu-collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, IconComponent],
})
export class MenuCollectionComponent {
  classifies = gooseCollection;

  store = store;
}
