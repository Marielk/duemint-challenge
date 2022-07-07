import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css']
})
export class CardFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(cardData: NgForm) {
    console.log(cardData.value);  // { first: '', last: '' }
    console.log(cardData.valid);  // false
  }
}
