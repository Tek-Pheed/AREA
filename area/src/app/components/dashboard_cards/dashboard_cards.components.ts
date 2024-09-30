import { Component, Input } from "@angular/core";

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

    constructor() {}
}
