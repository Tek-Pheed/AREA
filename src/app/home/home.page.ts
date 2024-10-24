import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    token: string = '';

    constructor(
        protected platform: Platform,
        private router: Router
    ) {}

    ngOnInit() {
        if (
            JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            ) != undefined &&
            JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            ) != null
        ) {
            if (!this.platform.is('desktop')) {
                this.router.navigate(['/tabs/home']);
            }
            this.token = JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            );
        }
    }

    protected readonly localStorage = localStorage;
    protected readonly JSON = JSON;
}
