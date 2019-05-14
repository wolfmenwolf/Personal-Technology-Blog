import {Component} from '@angular/core';

@Component({
  selector: 'card',
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      padding: 2rem;
      font-size: 2rem;
      font-family: 'Helvetica', sans-serif;
      font-weight: 300;
      background: #337AB7;
      color:#FFFFFF;
      margin: 1rem;
      display: inline-block;
    }
  `]
})
export class CardComponent {
  ngOnInit() {
    console.log('card component loaded!');
  }
}