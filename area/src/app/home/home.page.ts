import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    constructor(private platform: Platform) {}

    ngOnInit() {
        if (
            JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            ) != undefined &&
            JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            ) != null
        ) {
            if (this.platform.is('desktop')) {
                window.location.href = 'dashboard';
            } else {
                window.location.href = '/tabs/home';
            }
        }
    }
}
