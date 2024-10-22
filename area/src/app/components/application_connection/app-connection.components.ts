import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import { Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';

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

    async OAuthLogin(name: string, email: string, connected: boolean) {
        if (connected) {
            let token = JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            );
            this.service
                .logoutService(token, email, name.toLowerCase())
                .subscribe(
                    (res) => {
                        this.connected = false;
                    },
                    (err) => {
                        console.error(err);
                    }
                );
        } else {
            if (this.platform.is('desktop')) {
                location.href = `${environment.API_URL}/api/oauth/${name.toLowerCase()}/login`;
            } else {
                await Browser.open({
                    url: `${environment.API_URL}/api/oauth/${name.toLowerCase()}/login/${localStorage.getItem('Email')}`,
                });

                await Browser.addListener('browserFinished', () => {
                    window.location.reload();
                });
            }
        }
    }
}
