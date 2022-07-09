import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MONTHS, YEARS } from '../../constants';
import { CardNumberPipe } from '../../pipes/card-number.pipe';
import { Subscription } from 'rxjs';
import { ValidateCardNumberService } from '../../services/validateCardNumber.service';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css']
})
export class CardFormComponent implements OnInit, OnDestroy {
  cardData: FormGroup;
  cardNumberUpdated: string;
  cardTypeUpdated: string;
  cardNameUpdated: string;
  cardExpDateUpdated: string;
  cardCVVUpdated: string;
  deletLastCharacterUpdate = false;
  months: Array<string> = MONTHS;
  years: Array<string> = YEARS;
  subscriptions: Subscription[] = [];
  subscription2: Subscription;
  subscription3: Subscription;
  subscription4: Subscription;
  deletNumber: number;

  constructor(private usePipeToFormat: CardNumberPipe, private checkCardNumber: ValidateCardNumberService) { }

  ngOnInit(): void {
    this.initCardForm();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  onSubmit(cardData: FormGroup) {
    // send the information 
    console.log(cardData.value);
  }

  initCardForm() {
    this.cardData = new FormGroup({
      cardNumber: new FormControl(''),
      cardName: new FormControl(''),
      expiration: new FormGroup({
        expiringMonth: new FormControl(''),
        expiringYear: new FormControl(''),
      }),
      cvv: new FormControl('')
    });
    this.onFormChanges();
  }

  onFormChanges(): void {
    this.subscription2 = this.cardData.get('cardName').valueChanges.subscribe(val => {
      this.cardNameUpdated = val;
    });
    this.subscription3 = this.cardData.get('expiration').valueChanges.subscribe(val => {
      this.cardExpDateUpdated = val;
    });
    this.subscription4 = this.cardData.get('cvv').valueChanges.subscribe(val => {
      this.cardCVVUpdated = val;
    });
  }

  detectBackSpaceName = (ev: any) => {
    this.deletLastCharacterUpdate = ev.key === 'Backspace'; 
  }

  getNewCardNumberValue(ev: any): any {
    const currentValue = this.cardData.value.cardNumber;
    if (ev.key === 'Backspace') {
      this.deletNumber = Math.random();
      if(currentValue === '') {
        this.cardNumberUpdated = 'empty';
      } else {
        this.passNumberFormated(currentValue);
      }
    } else {
      this.passCardType(currentValue);
      const blockFormats = this.formatWithSpaces(currentValue);
      this.passNumberFormated(blockFormats);
    }
  }

  passCardType = (val) => {
    const cardType = this.checkCardNumber.getCardNumberType(val);
    if(cardType !== '') {
      this.cardTypeUpdated = cardType;
    }
  }
  
  passNumberFormated = (val) => {
    const formatedNumber = this.checkCardNumber.transformNumberDigits(val);
    // add "***" to number on card display
    if(formatedNumber) {
      this.cardNumberUpdated = formatedNumber;
    } else {
      this.cardNumberUpdated = val;
    }
  }

  formatWithSpaces = (val) => {
    let newValue = val;
    if(val.length > 3) {
      newValue = this.usePipeToFormat.transform(val);
    }
    this.cardData.controls["cardNumber"].setValue(newValue.trim());
    return newValue;
  }
}
