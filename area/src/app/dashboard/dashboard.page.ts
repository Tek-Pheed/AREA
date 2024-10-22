import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import {
    IActions,
    IApi,
    IAreaPair,
    IReactions,
    IUserConfig,
} from '../utils/data.models';
import { IonModal, Platform } from '@ionic/angular';
import { NavigationStart, Router } from '@angular/router';

interface activeArea {
    name: string;
    actionAPILogoUrl: string;
    reactionAPILogoUrl: string;
    configID: string | null;
    apiname: string;
}

@Component({
    selector: 'app-profil',
    templateUrl: 'dashboard.page.html',
    styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
    @ViewChild('editModal') editModal: IonModal | null = null;
    items: string[] = [];
    loadItems(loadItems: any) {
        throw new Error('Method not implemented.');
    }
    constructor(
        private service: ApiService,
        protected platform: Platform,
        private router: Router
    ) {
        this.router.events.subscribe((event: any): void => {
            if (event instanceof NavigationStart) {
                if (event.navigationTrigger === 'popstate') {
                    if (this.editModal != null) this.editModal.dismiss();
                }
            }
        });
    }

    userConfigs: IUserConfig[] = [];
    actions: IActions[] = [];
    reactions: IReactions[] = [];
    apis: IApi[] = [];
    datas: activeArea[] = [];
    showActiveArea: activeArea[] = [];
    searchText: string = '';
    token: string = '';

    currentLogs: string[] = [];
    isModalOpen = false;
    selectedLogs: string = '';
    logInterval: any = null;
    autoScroll: boolean = true;

    navigateToIntegrations() {
        if (this.platform.is('ios') || this.platform.is('android')) {
            this.router.navigate(['/tabs/integrations']);
        } else {
            this.router.navigate(['/dashboard/integrations']);
        }
    }

    handleInput(event: any) {
        const query = event.target.value.toLowerCase();

        this.showActiveArea = this.datas.filter(
            (integration) =>
                integration.name.toLowerCase().indexOf(query.toLowerCase()) > -1
        );
    }

    getApis() {
        this.service.getAllServices(this.token).subscribe(
            (res) => {
                this.apis = res.data;
                this.getActions();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getActions() {
        this.service.getActions(this.token).subscribe(
            (res) => {
                this.actions = res.data;
                this.getReactions();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getReactions() {
        this.service.getReactions(this.token).subscribe(
            (res) => {
                this.reactions = res.data;
                this.getConfig();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getConfig() {
        this.service.getUserConfigs(this.token).subscribe(
            (res) => {
                this.userConfigs = res.data;
                this.generateCards();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    generateCards() {
        this.datas = [];
        for (let element of this.userConfigs) {
            let action = this.actions.find(
                (elm) => elm.id === element.actions_id
            );
            let reaction = this.reactions.find(
                (elm) => elm.id === element.reaction_id
            );
            let apiA = this.apis.find((elm) => elm.name == action?.api_name);
            let apiB = this.apis.find((elm) => elm.name == reaction?.api_name);
            if (
                apiA == undefined ||
                apiB == undefined ||
                action == undefined ||
                reaction == undefined
            )
                continue;
            this.datas.push({
                name: `On ${action.title.toLowerCase()}, ${reaction.title.toLowerCase()}`,
                actionAPILogoUrl: apiA.icon_url,
                reactionAPILogoUrl: apiB.icon_url,
                configID: element.id,
                apiname: apiA.name,
            });
        }
        this.showActiveArea = this.datas.slice();
    }

    launchEditor(id: string | null) {
        if (id == null) return;
        this.router.navigate([`/dashboard/editor`], {
            queryParams: {
                configID: id,
            },
        });
    }

    deleteConfig(id: string) {
        this.token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );

        if (!confirm('Confirm suppression ?')) return;
        this.service.deleteUserConfigs(this.token, id).subscribe(
            (res) => {
                location.reload();
            },
            (err) => {
                console.error(err);
                alert(`Unable to delete user config: ${err}`);
            }
        );
    }

    selectServices(str: string, update: boolean) {
        this.selectedLogs = str;
        if (update) {
            this.getLogs();
        }
    }

    getLogs() {
        if (!this.isModalOpen) return;
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        let email = JSON.parse(
            JSON.stringify(localStorage.getItem('Email')) as string
        );
        this.service.getLogs(token, email, this.selectedLogs).subscribe(
            (res) => {
                this.currentLogs = res.logs;
                let objDiv = document.getElementById('codeDiv');
                if (objDiv == null) {
                    return;
                }
                if (this.autoScroll) objDiv.scrollTop = objDiv.scrollHeight;
            },
            (err) => {
                console.error(err);
            }
        );
    }

    setOpen(isOpen: boolean) {
        this.isModalOpen = isOpen;
        if (this.isModalOpen) {
            this.selectedLogs = '';
        }
    }

    getColor(str: string) {
        if (str.includes('INFO')) return 'green';
        if (str.includes('ERROR')) return 'red';
        if (str.includes('WARN')) return 'orange';
        return 'black';
    }

    ngOnInit(): void {
        this.token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        if (!this.token) {
            this.router.navigate(['/home']);
        }
        this.getApis();
        this.logInterval = setInterval(this.getLogs.bind(this), 2000);
    }
}
