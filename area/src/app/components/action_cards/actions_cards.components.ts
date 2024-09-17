import { Component, Input } from "@angular/core";

@Component({
    selector: "app-actions-cards",
    templateUrl: "actions_cards.components.html",
    styleUrls: ["actions_cards.components.scss"],
})
export class ActionsCardsComponent {
    @Input() title: string = "";
    @Input() description: string = "";
    @Input() background_color: string = "";
    @Input() image: string = "";

    constructor() {}
}
