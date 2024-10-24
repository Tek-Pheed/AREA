import { Component, EventEmitter, input, Input, Output } from "@angular/core";

@Component({
    selector: "app-dashboard-cards",
    templateUrl: "dashboard_cards.components.html",
    styleUrls: ["dashboard_cards.components.scss"],
})
export class DashboardCardsComponent {
    @Input() title: string = "";
    @Input() background_color: string = "transparent";
    @Input() image_1: string = "";
    @Input() image_2: string = "";
    @Input() id: string = "";
    @Input() service: string = '';

    @Output('onDeleteClicked') onDeleteClicked = new EventEmitter<string>();
    @Output('onCardClicked') onCardClicked = new EventEmitter<any>();

    constructor() {}

    getServiceColor(): string {
        switch (this.service) {
            case "Spotify":
                return ("#009b00")
            case "Twitch":
                return ("#7452a9");
            case "Github":
                return ("#344049");
            case "Unsplash":
                return ("#737373");
            case "Google":
                return ("#96d4ff");
            case "Discord":
                return ("#6b87ff");
        }
        return (this.background_color);
    }

    deleteCard() {
        this.onDeleteClicked.emit(this.id);
    }

    cardClicked() {
        this.onCardClicked.emit();
    }
}
