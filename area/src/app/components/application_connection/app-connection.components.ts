import { Component, Input } from "@angular/core";

@Component({
    selector: "app-connection-card",
    templateUrl: "app-connection.components.html",
    styleUrls: ["app-connection.components.scss"],
})
export class AppConnectedCardComponent {
    @Input() connected: boolean = false;

    @Input() app_name: string = "";
    @Input() app_icon: string = "";

    constructor() {}
}
