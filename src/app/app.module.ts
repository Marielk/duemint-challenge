import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AppComponent } from './app.component';
import { CardFormComponent } from './components/card-form/card-form.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';
import { CardNumberPipe } from './pipes/card-number.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CardFormComponent,
    CreditCardComponent, 
    CardNumberPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [CardNumberPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
