import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, AfterViewChecked  } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CardData } from '../../models/cardData';
import { CARD_NAME_DEFAULT,
  CARD_NUMBER_DEFAULT,
  BORDER_ANIMATION_OPTIONS,
  DATE_ANIMATION_OPTIONS,
  CARD_TYPES,
  CARD_LOGOS_CLASSES,
  CARD_LOGOS_PATH
} from '../../constants';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent implements OnInit, AfterViewChecked {
  cardNumber = CARD_NUMBER_DEFAULT;
  cardName = CARD_NAME_DEFAULT;
  expMonth = '';
  expYear = '';
  cvv = '';
  cvvInputGroup: FormGroup;
  spanGroup = [];
  removingLastChild = false;
  animatedBorderDefaultClass = 'hidde';
  cardAnimatedClassDefault = 'card ';
  animatedBorderClass = this.animatedBorderDefaultClass;
  cardAnimatedClass = this.cardAnimatedClassDefault;
  cardLogoDefaultPath = CARD_LOGOS_PATH[0];
  cardLogoPath = this.cardLogoDefaultPath;
  cardLogoDefaultClass = CARD_LOGOS_CLASSES[0];
  cardLogoClass = this.cardLogoDefaultClass;
  numberPlaceHolderCreated = false;


  @Input() set updateCardNumber(data: string) {
    if (!data) { return; }
    if (data === 'empty') {
      this.cleanNumberPlace();
      this.createNumbersPlacesholders();
    } else {
      this.processCardNumber(data);
    }
  }

  @Input() set updateDeletNumber(data: number) {
    this.replaceNumWithHash();
  }

  @Input() set cardType(data: string) {
    this.processCardType(data);
  }

  @Input() set updateCardName(data: string) {
    if (this.removingLastChild) {
      this.removeLastCharacter();
      if (data.length === 0) {
        this.cardName = CARD_NAME_DEFAULT;
        return;
      }
      return;
    }
    if (!data) { return; }
    this.processCardName(data);
  }

  @Input() set deletLastCharacter(remove: boolean) {
    this.removingLastChild = remove;
  }

  @Input() set updateExpDate(data: CardData['expiration']) {
    if (!data) { return; }
    this.processExpDate(data);
  }

  @Input() set updateCVV(data: string) {
    if (!data) { return; }
    this.processCVV(data);
  }

  @ViewChild('monthPlaceholder', { read: ElementRef }) monthPlaceholder: ElementRef;
  @ViewChild('monthContent', { read: ElementRef }) monthContent: ElementRef;
  @ViewChild('yearPlaceholder', { read: ElementRef }) yearPlaceholder: ElementRef;
  @ViewChild('yearContent', { read: ElementRef }) yearContent: ElementRef;
  @ViewChild('cardNamePlace', { read: ElementRef }) cardNamePlace: ElementRef;
  @ViewChild('cardNumberPlace', { read: ElementRef }) cardNumberPlace: ElementRef;

  constructor( private renderer: Renderer2 ) { }

  ngOnInit(): void {
    this.cvvInputGroup = new FormGroup({
      cvvShow: new FormControl()
   });
  }

  ngAfterViewChecked(): void {
    if (this.cardNumberPlace && !this.numberPlaceHolderCreated) {
      this.createNumbersPlacesholders();
      this.numberPlaceHolderCreated = true;
    }
  }

  processCardType = (data: string) => {
    switch (data) {
      case CARD_TYPES[0]:
        this.cardLogoClass = CARD_LOGOS_CLASSES[0];
        this.cardLogoPath = CARD_LOGOS_PATH[0];
        break;
      case CARD_TYPES[1]:
        this.cardLogoClass = CARD_LOGOS_CLASSES[1];
        this.cardLogoPath = CARD_LOGOS_PATH[1];
        break;
      case CARD_TYPES[2]:
        this.cardLogoClass = CARD_LOGOS_CLASSES[2];
        this.cardLogoPath = CARD_LOGOS_PATH[2];
        break;
      case CARD_TYPES[3]:
        this.cardLogoClass = CARD_LOGOS_CLASSES[3];
        this.cardLogoPath = CARD_LOGOS_PATH[3];
        break;
      case CARD_TYPES[4]:
        this.cardLogoClass = CARD_LOGOS_CLASSES[4];
        this.cardLogoPath = CARD_LOGOS_PATH[4];
        break;
      default:
        this.cardLogoPath = this.cardLogoDefaultPath;
        this.cardLogoClass = this.cardLogoDefaultClass;
    }
  }

  processCardNumber = (data: string) => {
    if (data) {
      this.cardNumber = data;
      this.animateBorder(BORDER_ANIMATION_OPTIONS[0]);
      this.animateCardNumber();
    } else {
      this.animateBorder('');
      this.cardNumber = CARD_NUMBER_DEFAULT;
    }
  }

  animateCardNumber = () => {
    this.replaceHashWithNumber();
    return;
  }

  replaceHashWithNumber = () => {
    const separateCharacters = this.cardNumber.split('');
    const lastCharacter = separateCharacters[separateCharacters.length - 1];
    if (lastCharacter === ' ') { return; }
    const index = separateCharacters.length - 1;
    const placeholder = this.cardNumberPlace.nativeElement.children[index];
    const span = this.renderer.createElement('span');
    span.innerHTML = lastCharacter;
    span.className = 'card-number-span';
    const sidePosition = 15 * index;
    span.style.setProperty('left', `${sidePosition}px`);
    if (!placeholder) { return; }
    this.renderer.insertBefore(this.cardNumberPlace.nativeElement, span, placeholder);
    this.renderer.removeChild(this.cardNumberPlace.nativeElement, placeholder);
    return;
  }

  replaceNumWithHash = () => {
    if (!this.cardNumberPlace) { return; }
    const spanElements = this.cardNumberPlace.nativeElement.children;
    const usedSpaced = Array.from(spanElements).slice(0, this.cardNumber.length + 1);
    const lastSpan = usedSpaced[usedSpaced.length - 1];
    const index = usedSpaced.indexOf(lastSpan);
    if (!lastSpan) { return; }
    const newSpan = this.renderer.createElement('span');
    this.keepBlankSpaces(lastSpan, usedSpaced, newSpan, index);
  }

  keepBlankSpaces = (lastSpan, spansCollection, newSpan, index) => {
    Array.from(spansCollection).map((span: HTMLElement) => {
      if (span.innerHTML === ' ' && span === lastSpan) {
        newSpan.innerHTML = ' ';
      } else {
        newSpan.innerHTML = '#';
      }
    });
    const sidePosition = 15 * index;
    newSpan.className = 'card-number-span-hash';
    newSpan.style.setProperty('left', `${sidePosition}px`);
    this.renderer.insertBefore(this.cardNumberPlace.nativeElement, newSpan, lastSpan);
    this.renderer.removeChild(this.cardNumberPlace.nativeElement, lastSpan);
  }

  cleanNumberPlace = () => {
    const spanElements = this.cardNumberPlace.nativeElement.children;
    Array.from(spanElements).map((el: HTMLElement) => {
      this.renderer.removeChild(this.cardNumberPlace.nativeElement, el);
    });
  }

  createNumbersPlacesholders = () => {
    const separateSpaces = CARD_NUMBER_DEFAULT.split('');
    separateSpaces.forEach((el, i) => {
      const span = this.renderer.createElement('span');
      span.innerHTML = el;
      const sidePosition = 15 * i;
      span.style.setProperty('position', 'absolute');
      span.style.setProperty('left', `${sidePosition}px`);
      this.renderer.appendChild(this.cardNumberPlace.nativeElement, span);
    });
    return;
  }

  processCardName = (data: string) => {
    this.cardName = '';
    const separateCharacters = data.split('');
    const lastCharacter = separateCharacters[separateCharacters.length - 1];
    this.spanGroup.push(lastCharacter);
    const span = this.renderer.createElement('span');
    span.innerHTML = lastCharacter;
    this.renderer.appendChild(this.cardNamePlace.nativeElement, span);
    span.className = 'card-holder-name-span';
    const indexOfChar = this.spanGroup.length;
    span.style.setProperty('--i', indexOfChar.toString());
    const sidePosition = 12 * indexOfChar;
    span.style.setProperty('left', `${sidePosition}px`);
    this.animateBorder(BORDER_ANIMATION_OPTIONS[1]);
  }

  removeLastCharacter = () => {
    if (this.spanGroup.length === 0) { return; }
    this.spanGroup.splice(-1, 1);
    const lastChild = this.cardNamePlace.nativeElement.lastElementChild;
    this.renderer.removeChild(this.cardNamePlace.nativeElement, lastChild);
  }

  processExpDate = (data: CardData['expiration']) => {
    this.expMonth = data.expiringMonth;
    this.animateBorder(BORDER_ANIMATION_OPTIONS[2]);
    this.animateDate(DATE_ANIMATION_OPTIONS[0]);
    if (data.expiringYear) {
      this.expYear = data.expiringYear.substring(2, 4);
      this.animateDate(DATE_ANIMATION_OPTIONS[1]);
    }
  }

  processCVV = (data: string) => {
    this.cvv = data;
    this.animateBorder('');
    this.animateCard();
    this.cvvInputGroup.controls.cvvShow.setValue(data);
  }

  animateDate = (animation: string) => {
    if (!this.monthPlaceholder) { return; }
    if (animation === DATE_ANIMATION_OPTIONS[0]) {
      this.monthPlaceholder.nativeElement.classList.add('animate-date-out');
      this.monthContent.nativeElement.classList.add('animate-date-in');
    }
    if (animation === DATE_ANIMATION_OPTIONS[1]) {
      this.yearPlaceholder.nativeElement.classList.add('animate-date-out');
      this.yearContent.nativeElement.classList.add('animate-date-in');
    }
  }

  animateCard = () => {
    this.cardAnimatedClass = this.cardAnimatedClassDefault + 'card-animation';
    document.addEventListener('click', () => {
      this.cardAnimatedClass = this.cardAnimatedClassDefault;
    });
  }

  animateBorder = (position: string) => {
    this.animatedBorderClass = 'show';
    switch (position) {
      case BORDER_ANIMATION_OPTIONS[0]:
      this.animatedBorderClass = 'show start-position';
      break;
      case BORDER_ANIMATION_OPTIONS[1]:
      this.animatedBorderClass = 'show move-to-name-place';
      break;
      case BORDER_ANIMATION_OPTIONS[2]:
      this.animatedBorderClass = 'show move-to-date-place';
      break;

      default:
      this.animatedBorderClass = this.animatedBorderDefaultClass;
      break;
    }
  }
}
