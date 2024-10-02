import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import { APIServices, IActions } from '../utils/data.models';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-integration',
    templateUrl: 'integrations.page.html',
    styleUrls: ['integrations.page.scss'],
})
export class IntegrationsPage implements OnInit {
    integrations: APIServices[] = [];
    selectedIntegration: string = '';
    actions: IActions[] = [];
    actionResults: IActions[] = [];
    inSearch: boolean = false;
    searchText: string = '';

    getimgsrc(title: string) {
        let res = this.integrations.find(
            ({ name }) => name === title
        )?.icon_url;
        if (res == undefined) return 'assets/favicon.png';
        return res;
    }

    constructor(
        private service: ApiService,
        protected platform: Platform
    ) {}

    selectIntegration(str: string) {
        this.inSearch = true;
        this.searchText = str.toLowerCase();
        this.actionResults = this.actions.filter(
            (d) => d.api_name.toLowerCase().indexOf(str.toLowerCase()) > -1
        );
    }

    createConfigFromActionId(id: number) {
        location.href = `/editeur?actionID=${id.toString()}`
    }

    handleInput(event: any) {
        const query = event.target.value.toLowerCase();
        this.searchText = query;
        if (query.length > 0) {
            this.inSearch = true;
        } else {
            this.inSearch = false;
        }
        this.actionResults = this.actions.filter(
            (d) =>
                d.title.toLowerCase().indexOf(query) > -1 ||
                d.api_name.toLowerCase().indexOf(query) > -1
        );
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
                this.actionResults = res.data;
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
