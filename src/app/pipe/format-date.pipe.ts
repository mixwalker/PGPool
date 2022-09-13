import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: Date): string {
    const date = new Date(value);
    return date.toLocaleDateString("th-TH",{
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

}
