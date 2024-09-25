import { Component, Input } from "@angular/core";
import { toLower } from "ionicons/dist/types/components/icon/utils";
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

    constructor() {}

    OAuthLogin(name: string) {
        location.href = `http://localhost:3000/api/oauth/${name.toLowerCase()}/login`
    }
}
