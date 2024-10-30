import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../utils/api.services';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-about',
    templateUrl: 'about.page.html',
    styleUrls: ['about.page.scss'],
})
export class AboutPage implements OnInit {
    about: any;

    constructor(protected api: ApiService) {}

    ngOnInit() {
        this.api.getAboutJson().subscribe((res) => {
            this.about = res;
        });
    }

    protected readonly environment = environment;
}
