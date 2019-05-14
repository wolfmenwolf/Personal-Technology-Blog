import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MyHighLightDirective } from './directives/my-high-light.directive';
import { DelayDirective } from './directives/delay.directive';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    MyHighLightDirective,
    DelayDirective,
    CardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
