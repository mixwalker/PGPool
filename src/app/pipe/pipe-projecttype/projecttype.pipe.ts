import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projecttype'
})
export class ProjecttypePipe implements PipeTransform {

  transform(value: '1' | '2' | '3' | '4'): unknown {
    switch (value) {
      case '1':
        return 'Pre Contract'
      case '2':
        return 'Contract'
      case '3':
        return 'Inhouse'
      case '4':
        return 'MA'
    }
  }

}
