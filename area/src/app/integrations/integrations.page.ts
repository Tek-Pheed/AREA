import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import { APIServices, IActions } from '../utils/data.models';

@Component({
    selector: 'app-integration',
    templateUrl: 'integrations.page.html',
    styleUrls: ['integrations.page.scss'],
})
export class IntegrationsPage implements OnInit {
    integrations: APIServices[] = [];
    selectedIntegration: string = '';
    actions: IActions[] = [];

    getimgsrc(title: string) {
        let res = this.integrations.find(
            ({ name }) => name === title
        )?.icon_url;
        if (res == undefined) return 'assets/favicon.png';
        return res;
    }

    constructor(private service: ApiService) {}

    selectIntegration(str: string) {
        this.selectedIntegration = str;
    }

    getAllServices() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getAllServices(token).subscribe(
            (res) => {
                console.warn(res.data);
                this.integrations = res.data;
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getAllActions() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getActions(token).subscribe(
            (res) => {
                console.warn(res.data);
                this.actions = res.data;
            },
            (err) => {
                console.error(err);
            }
        );
    }

    ngOnInit(): void {
        this.getAllServices();
        this.getAllActions();
    }
}
