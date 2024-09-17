import { Component } from '@angular/core';

@Component({
  selector: 'app-actions-cards',
  templateUrl: 'actions_cards.components.html',
  styleUrls: ['actions_cards.components.scss'],
})
export class ActionsCardsComponent {
  title: string = 'Youtube';
  description: string = 'New video from @xxx posted';

  constructor() {}
}