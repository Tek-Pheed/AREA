import { Component, Input } from '@angular/core';
import { toLower } from 'ionicons/dist/types/components/icon/utils';
import { ApiService } from 'src/utils/api.services';

@Component({
    selector: 'app-connection-card',
    templateUrl: 'app-connection.components.html',
    styleUrls: ['app-connection.components.scss'],
})
export class AppConnectedCardComponent {
    @Input() connected: boolean = false;

    @Input() app_name: string = '';
    @Input() app_icon: string = '';
    @Input() email: string = '';

    constructor(private service: ApiService) {}

    OAuthLogin(name: string, email: string, connected: boolean) {
        if (connected) {
            let token = JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            );
            this.service
                .logoutService(token, email, name.toLowerCase())
                .subscribe(
                    (res) => {
                        location.href = `http://localhost:4200/profile`;
                        console.warn(res.data);
                    },
                    (err) => {
                        console.error(err);
                    }
                );
        } else {
            location.href = `http://localhost:3000/api/oauth/${name.toLowerCase()}/login`;
        }
    }
}
