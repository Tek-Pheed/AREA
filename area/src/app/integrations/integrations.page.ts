import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';

interface APIServices {
    name: string;
    connected: boolean;
    imgsrc: string;
}

interface ActionReaction {
    title: string;
    description: string;
}

@Component({
    selector: 'app-integration',
    templateUrl: 'integrations.page.html',
    styleUrls: ['integrations.page.scss'],
})
export class IntegrationsPage implements OnInit {
    integrations: APIServices[] = [];

    actions: ActionReaction[] = [];

    getimgsrc(title: string) {
        let res = this.integrations.find(({ name }) => name === title)?.imgsrc;

        console.warn(res);

        if (res == undefined) return 'assets/favicon.png';
        return res;
    }

    constructor(private service: ApiService) {}

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
