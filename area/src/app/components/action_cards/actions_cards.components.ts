import { Component, EventEmitter, Input, Output } from "@angular/core";
import {CommonModule} from '@angular/common';

@Component({
    selector: "app-actions-cards",
    templateUrl: "actions_cards.components.html",
    styleUrls: ["actions_cards.components.scss"],
    standalone: true,
    imports: [CommonModule]
})
export class ActionsCardsComponent {
    @Input() title: string = "";
    @Input() description: string = "";
    @Input() background_color: string = "";
    @Input() image: string = "";
    @Input() editable: boolean = false;
    @Input() id: string = "";

    @Output() onCardClicked = new EventEmitter<string>();
    @Output() onEditClicked = new EventEmitter<string>();

    constructor() {}

    cardClicked() {
        this.onCardClicked.emit(this.id);
    }

    editClicked() {
        this.onEditClicked.emit(this.id);
    }
}
