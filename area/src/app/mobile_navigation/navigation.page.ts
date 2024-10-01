import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-mobile_navigation',
    templateUrl: 'navigation.page.html',
    styleUrls: ['navigation.page.scss'],
})
export class NavigationPage {
    constructor(private platform: Platform) {
        if (this.platform.is('desktop')) {
            window.location.href = '/';
        }
    }
}
