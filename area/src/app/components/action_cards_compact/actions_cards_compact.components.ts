import { CommonModule } from '@angular/common';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-actions-cards-compact',
  templateUrl: 'actions_cards_compact.components.html',
  styleUrls: ['actions_cards_compact.components.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ActionsCardsCompactComponent {

  @Input() action_name: string = "";
  @Input() connected: boolean = true;
  @Input() iconUrl: string = "assets/icon/favicon.png";

  constructor() {}
}
