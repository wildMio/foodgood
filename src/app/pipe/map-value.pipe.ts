import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapValue',
  standalone: true,
})
export class MapValuePipe implements PipeTransform {
  transform<T>(value: { [key: string]: T }, key: string): T {
    return value[key];
  }
}
