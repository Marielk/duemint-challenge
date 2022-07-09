import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardNumberPipe'
})

/**
 * Transform card number to 4 digits format 
 */
export class CardNumberPipe implements PipeTransform {

  transform(value: string): string {
    let formatedNumbers = '';
    if(!value || value.length < 4) return;
    let parts = [];
    for (let i = 0, len = value.length; i < len; i += 4) {
      const sanitizedValue = value.replace(/[^0-9]/gi, '');
      parts.push(sanitizedValue.slice(i, i + 4));
    }
    formatedNumbers = parts.join(' ');
    return formatedNumbers
  }

}