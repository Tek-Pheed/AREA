import { Component, Input } from '@angular/core';
import { toLower } from 'ionicons/dist/types/components/icon/utils';
import { ApiService } from 'src/utils/api.services';
import { Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

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

    constructor(
        private service: ApiService,
        private platform: Platform,
        private router: Router
    ) {}

    OAuthLogin(name: string, email: string, connected: boolean) {
        if (connected) {
            let token = JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            );
            this.service
                .logoutService(token, email, name.toLowerCase())
                .subscribe(
                    (res) => {
                        if (this.platform.is('mobile')) {
                            this.router.navigate(['/tabs/profile']);
                        } else {
                            this.router.navigate(['/dashboard/profile']);
                        }
                    },
                    (err) => {
                        console.error(err);
                    }
                );
        } else {
            location.href = `http://localhost:8080/api/oauth/${name.toLowerCase()}/login`;
        }
    }
}
