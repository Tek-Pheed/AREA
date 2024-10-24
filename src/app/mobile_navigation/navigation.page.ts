import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mobile_navigation',
    templateUrl: 'navigation.page.html',
    styleUrls: ['navigation.page.scss'],
})
export class NavigationPage {
    constructor(
        private platform: Platform,
        private router: Router
    ) {
        if (this.platform.is('desktop')) {
            this.router.navigate(['/dashboard']);
        }
    }
}
