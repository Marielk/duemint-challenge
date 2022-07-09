import { Injectable } from '@angular/core';
import { CARD_TYPES } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ValidateCardNumberService {
  visaRegEx = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
  mastercardRegEx = new RegExp('^5[1-5][0-9]{14}$');
  amexpRegEx = new RegExp('^3[47][0-9]{13}$');
  discovRegEx = new RegExp('^6011[0-9]{12}[0-9]*$');
  dinersRegEx = new RegExp('^3[0689][0-9]{12}[0-9]*$');

  getCardNumberType = (cardNumber: string) => {
    const sanitizedValue = cardNumber.replace(/[^0-9]/gi, '');
    let cardType= '';

    if (this.visaRegEx.test(sanitizedValue)) {
      cardType = CARD_TYPES[0];
    } else if(this.mastercardRegEx.test(sanitizedValue)) {
      cardType = CARD_TYPES[1];
    } else if(this.amexpRegEx.test(sanitizedValue)) {
      cardType = CARD_TYPES[2];
    } else if(this.discovRegEx.test(sanitizedValue)) {
      cardType = CARD_TYPES[3];
    } else if(this.dinersRegEx.test(sanitizedValue)) {
      cardType = CARD_TYPES[4];
    }
    return cardType;
  }

  transformNumberDigits = (cardNumber: string) => {   
    const separateCharacters = cardNumber.split('');
    const cleanCharts = this.cleanSpaces(separateCharacters);
    const modifyCharts = this.replaceNumbers(cleanCharts);
    const separateBlocks = this.separateBlocks(modifyCharts);
    if(separateBlocks) {
      return separateBlocks;
    }
  }

  private cleanSpaces = (characters: Array<string>) => {
    const cleanCharts = characters.filter((char) => {
      if(char !== ' ') {
        return char; 
      }
    });
    return cleanCharts;
  }

  private replaceNumbers = (cleanCharts) => {
    let modifyCharts = [];
    if(cleanCharts.length > 4) {
      cleanCharts.map((char, i) => {
        if (i > 3 && i < 12) {
          modifyCharts.push('*')
        } else {
          modifyCharts.push(char)
        }
      })
    }
    return modifyCharts;
  }

  private separateBlocks = (modifyCharts) => {
    const parts = [];
    if(modifyCharts.length === 0) return
    for (let i = 0, len = modifyCharts.length; i < len; i += 4) {
      parts.push(modifyCharts.slice(i, i + 4));
    }
    const join = this.joinBlocks(parts);
    return join;
  }

  private joinBlocks = (parts) => {
    if(parts.length < 1) return
    const joinBlocks = parts.map(arr => arr.join(''));
    return joinBlocks.join(' ');
  }
}
