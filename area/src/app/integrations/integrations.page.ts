import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import { APIServices, IActions } from '../utils/data.models';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

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
    token: string = '';

    constructor(
        private service: ApiService,
        protected platform: Platform,
        private router: Router
    ) {}

    getimgsrc(title: string) {
        let res = this.integrations.find(
            ({ name }) => name === title
        )?.icon_url;
        if (res == undefined) return 'assets/favicon.png';
        return res;
    }

    selectIntegration(str: string, connected: boolean) {
        if (!connected) {
            if (this.platform.is('desktop')) {
                this.router.navigate(['/dashboard/profile']);
            } else {
                this.router.navigate(['/tabs/profile']);
            }
            return;
        }
        this.inSearch = true;
        this.searchText = str.toLowerCase();
        this.actionResults = this.actions.filter(
            (d) => d.api_name.toLowerCase().indexOf(str.toLowerCase()) > -1
        );
    }

    createConfigFromActionId(id: number) {
        this.router.navigate([`/dashboard/editor`], {
            queryParams: { actionID: id },
        });
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

    isServiceConnected(api_name: string) {
        let int = this.integrations.find((elm) => (elm.name == api_name));
        if (int != undefined) {
            return (int.connected);
        } else {
            return (false);
        }
    }

    getAllServices() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getAllServices(token).subscribe(
            (res) => {
                this.integrations = res.data;
                console.log(this.integrations);
                this.integrations.splice(this.integrations.findIndex((elm) => (elm.name.toLowerCase() == 'nexus')), 1);
            },
            (err) => {
                console.error(err);
            },
            () => {
                this.service.getAllConnections(this.token).subscribe((res) => {
                    let data = res.data[0];
                    for (let i = 0; i < this.integrations.length; i++) {
                        if (
                            data.githubAccessToken != null &&
                            this.integrations[i].name.toLowerCase() === 'github'
                        ) {
                            this.integrations[i].connected = true;
                        }

                        if (
                            data.spotifyAccessToken != null &&
                            data.spotifyRefreshToken != null &&
                            this.integrations[i].name.toLowerCase() ===
                                'spotify'
                        ) {
                            this.integrations[i].connected = true;
                        }

                        if (
                            data.twitchAccessToken != null &&
                            data.twitchRefreshToken != null &&
                            this.integrations[i].name.toLowerCase() === 'twitch'
                        ) {
                            this.integrations[i].connected = true;
                        }

                        if (
                            data.googleAccessToken != null &&
                            this.integrations[i].name.toLowerCase() === 'google'
                        ) {
                            this.integrations[i].connected = true;
                        }

                        if (
                            data.unsplashAccessToken != null &&
                            this.integrations[i].name.toLowerCase() ===
                                'unsplash'
                        ) {
                            this.integrations[i].connected = true;
                        }

                        if (
                            data.discordAccessToken != null &&
                            data.discordRefreshToken != null &&
                            this.integrations[i].name.toLowerCase() ===
                                'discord'
                        ) {
                            this.integrations[i].connected = true;
                        }
                    }
                });
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
        this.token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        if (!this.token) {
            this.router.navigate(['/home']);
        }
        this.getAllServices();
        this.getAllActions();
    }
}
