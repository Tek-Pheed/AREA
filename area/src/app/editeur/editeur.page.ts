import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/utils/api.services';
import { ActivatedRoute } from '@angular/router';
import {
    APIServices,
    IActions,
    IHeaderProperties,
    IModalFields,
    IModalVariables,
    IReactions,
} from '../utils/data.models';

interface UserConfig {
    action_id: number;
    method: string;
    headers: any;
    body: any;
    reaction_id: number;
}

@Component({
    selector: 'app-editeur',
    templateUrl: 'editeur.page.html',
    styleUrls: ['editeur.page.scss'],
})
export class EditeurPage implements OnInit {
    private actionID: string | null = '';
    private reactionID: string | null = '';
    private configID: string | null = '';

    integrations: APIServices[] = [];
    actions: IActions[] = [];
    reactions: IReactions[] = [];

    selectedAction: IActions | undefined = undefined;
    selectedReaction: IReactions | undefined = undefined;

    actionModalShow: boolean = false;
    actionProperties: IHeaderProperties = { name: '', img_src: '' };
    actionFields: IModalFields[] = [];
    actionVariables: IModalVariables[] = [];

    reactionModalShow: boolean = false;
    reactionProperties: IHeaderProperties = { name: '', img_src: '' };
    reactionFields: IModalFields[] = [];
    reactionVariables: IModalVariables[] = [];

    openActionModal() {
        if (this.selectedAction != undefined) {
            this.actionProperties.img_src = this.getimgsrc(
                this.selectedAction.api_name
            );
            this.actionProperties.name = this.selectedAction.api_name;
            this.actionModalShow = true;
        }
    }

    openReactionModal() {
        if (this.selectedReaction != undefined) {
            this.reactionProperties.img_src = this.getimgsrc(
                this.selectedReaction.api_name
            );
            this.reactionProperties.name = this.selectedReaction.api_name;
            this.reactionModalShow = true;
        }
    }

    actionModalClosed(data: any) {
        this.actionModalShow = false;
        console.log(data);
    }

    reactionModalClose(data: any) {
        this.reactionModalShow = false;
        console.log(data);
    }

    swapAction(id: string) {
        console.log("swapAction");
    }

    swapReactions(id: string) {
        console.log("swapReaction");
    }

    getAllData() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getAllServices(token).subscribe(
            (res) => {
                console.warn(res.data);
                this.integrations = res.data;
                this.getAllActions();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getimgsrc(title: string | undefined) {
        if (title == undefined) return '';
        let res = this.integrations.find(
            ({ name }) => name === title
        )?.icon_url;
        if (res == undefined) return 'assets/favicon.png';
        return res;
    }

    getAllActions() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getActions(token).subscribe(
            (res) => {
                console.warn(res.data);
                this.actions = res.data;
                this.getAllReactions();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    loadConfig() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );

        this.service.getUserConfigs(token).subscribe(
            (res) => {
                console.error(res.data);
                if (this.configID != null && this.configID != undefined) {
                    let config: any = res.data.filter(
                        (obj: any) => obj.id == this.configID
                    );
                    if (config != undefined && config[0] != undefined) {
                        config = config[0];
                        this.actionID = config.actions_id;
                        this.reactionID = config.reaction_id;
                    }
                }
                this.getAllDatas();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getAllReactions() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getReactions(token).subscribe(
            (res) => {
                console.warn(res.data);
                this.reactions = res.data;
                this.loadConfig();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getAllDatas() {
        if (this.actionID != null) {
            this.selectedAction = this.actions.filter(
                (a) => a.id == Number(this.actionID)
            )[0];
        }
        if (this.reactionID != null) {
            this.selectedReaction = this.reactions.filter(
                (a) => a.id == Number(this.reactionID)
            )[0];
        }
        console.log(this.selectedAction);
        console.log(this.selectedReaction);
    }

    constructor(
        private router: Router,
        private service: ApiService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        let url: string = window.location.href;
        const searchParams = new URLSearchParams(url.split('?')[1]);
        this.configID = `${searchParams.get('configID')}`;
        this.actionID = `${searchParams.get('actionID')}`;
        this.getAllData();
    }
}
