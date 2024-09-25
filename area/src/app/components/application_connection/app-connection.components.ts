import { Component, Input } from "@angular/core";
import { ApiService } from "src/utils/api.services";

@Component({
    selector: "app-connection-card",
    templateUrl: "app-connection.components.html",
    styleUrls: ["app-connection.components.scss"],
})
export class AppConnectedCardComponent {
    @Input() connected: boolean = false;

    @Input() app_name: string = "";
    @Input() app_icon: string = "";

    constructor(private service: ApiService) {}

    OAuthLogin() {
        console.log("Truc")
        location.href = "http://localhost:3000/api/oauth/spotify/login"
    }
}
