import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import { IActions, IApi, IAreaPair, IReactions } from '../utils/data.models';

interface activeArea {
    name: string;
    actionAPILogoUrl: string;
    reactionAPILogoUrl: string;
}

@Component({
    selector: 'app-profil',
    templateUrl: 'dashboard.page.html',
    styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
    constructor(private service: ApiService) {}

    userConfigs: IAreaPair[] = [];
    actions: IActions[] = [];
    reactions: IReactions[] = [];
    apis: IApi[] = [];
    datas: activeArea[] = [];

    getApis() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );

        this.service.getAllServices(token).subscribe(
            (res) => {
                console.log(res.data);
                this.apis = res.data;
                this.getActions();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getActions() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );

        this.service.getActions(token).subscribe(
            (res) => {
                console.log(res.data);
                this.actions = res.data;
                this.getReactions();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getReactions() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );

        this.service.getReactions(token).subscribe(
            (res) => {
                console.log(res.data);
                this.reactions = res.data;
                this.getConfig();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getConfig() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );

        this.service.getUserConfigs(token).subscribe(
            (res) => {
                console.log(res.data);
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
            let apiA = this.apis.find((elm) => elm.id == element.actions_id);
            let apiB = this.apis.find((elm) => elm.id == element.reaction_id);

            let action = this.actions.find(
                (elm) => elm.id === element.actions_id
            );
            let reaction = this.reactions.find(
                (elm) => elm.id === element.reaction_id
            );

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
            });
        }
        console.warn(this.datas);
    }

    ngOnInit(): void {
        this.getApis();
    }
}