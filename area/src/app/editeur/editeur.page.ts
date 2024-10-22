import { Component, OnInit } from '@angular/core';
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
    IUserConfig,
} from '../utils/data.models';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-editeur',
    templateUrl: 'editeur.page.html',
    styleUrls: ['editeur.page.scss'],
})
export class EditeurPage implements OnInit {
    public actionID: string | null = '';
    public reactionID: string | null = '';
    private configID: string | null = '';

    integrations: APIServices[] = [];
    actions: IActions[] = [];
    reactions: IReactions[] = [];

    loadedConfig: IUserConfig | undefined;

    selectedAction: IActions | undefined = undefined;
    selectedReaction: IReactions | undefined = undefined;
    token: string = '';

    date = new Date();

    actionModalShow: boolean = false;
    actionProperties: IHeaderProperties = {
        name: '',
        img_src: '',
        description: '',
    };
    actionFields: IModalFields[] = [];
    actionVariables: IModalVariables[] = [];

    reactionModalShow: boolean = false;
    reactionProperties: IHeaderProperties = {
        name: '',
        img_src: '',
        description: '',
    };
    reactionFields: IModalFields[] = [];
    reactionVariables: IModalVariables[] = [];

    actionSwapModalOpen: boolean = false;
    reactionSwapModalOpen: boolean = false;
    component: {
        api_name: string;
        description: string;
        id: number;
        input: never[];
    } = {
        api_name: '',
        description: '',
        id: 0,
        input: [],
    };

    openActionModal() {
        if (this.selectedAction != undefined) {
            let i = 0;
            for (let element of this.actionFields) {
                this.actionFields[i].fieldValue =
                    element.fieldType == 'datetime' && element.fieldValue == ''
                        ? this.date.toISOString()
                        : this.actionFields[i].fieldValue;
                i++;
            }
            this.actionProperties.img_src = this.getimgsrc(
                this.selectedAction.api_name
            );
            this.actionProperties.name = this.selectedAction.api_name;
            this.actionProperties.description = this.selectedAction.description;
            this.actionModalShow = true;
        }
    }

    openReactionModal() {
        if (this.selectedReaction != undefined) {
            let i = 0;
            for (let element of this.reactionFields) {
                this.reactionFields[i].fieldValue =
                    element.fieldType == 'datetime' && element.fieldValue == ''
                        ? this.date.toISOString()
                        : this.reactionFields[i].fieldValue;
                i++;
            }
            this.reactionProperties.img_src = this.getimgsrc(
                this.selectedReaction.api_name
            );
            this.reactionProperties.name = this.selectedReaction.api_name;
            this.reactionProperties.description =
                this.selectedReaction.description;
            this.reactionModalShow = true;
        }
    }

    actionModalClosed(data: IModalFields[]) {
        this.actionModalShow = false;
        if (data == undefined || data.length == 0) return;
        this.actionFields = data;
    }

    reactionModalClose(data: IModalFields[]) {
        this.reactionModalShow = false;
        if (data == undefined || data.length == 0) return;
        this.reactionFields = data;
    }

    swapAction() {
        this.actionSwapModalOpen = true;
    }

    swapActionSave(id: any) {
        this.actionSwapModalOpen = false;
        if (id != undefined && id != '' && !isNaN(Number(id))) {
            this.actionID = id;
            this.getAllDatas(true, false);
        }
    }

    swapReactionSave(id: any) {
        this.reactionSwapModalOpen = false;
        if (id != undefined && id != '' && !isNaN(Number(id))) {
            this.reactionID = id;
            this.getAllDatas(false, true);
        }
    }

    swapReactions() {
        this.reactionSwapModalOpen = true;
    }

    getAllData() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getAllServices(token).subscribe(
            (res) => {
                this.integrations = res.data;
                this.getAllActions();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getimgsrc(title: string | undefined) {
        if (title == undefined) return 'assets/question-mark-round-icon.svg';
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
                if (this.configID != null && this.configID != undefined) {
                    let config: any = res.data.filter(
                        (obj: any) => obj.id == this.configID
                    );
                    let url: string = window.location.href;
                    const searchParams = new URLSearchParams(url.split('?')[1]);
                    if (config != undefined && config[0] != undefined) {
                        config = config[0];
                        this.loadedConfig = config;
                        this.actionID = config.actions_id;
                        this.reactionID = config.reaction_id;
                    } else if (searchParams.get('configID') != null) {
                        alert('Unable to find corresponding user config');
                        if (this.platform.is('desktop')) {
                            this.router.navigate(['/dashboard']);
                        } else {
                            this.router.navigate(['/tabs/home']);
                        }
                    }
                }
                this.getAllDatas();
                if (this.configID == null) {
                    this.swapReactions();
                }
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
                this.reactions = res.data;
                this.loadConfig();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    getAllDatas(updateAction: boolean = true, updateReaction: boolean = true) {
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
        if (updateAction) {
            this.actionFields = [];
            this.actionVariables = [];
            if (
                this.selectedAction != undefined &&
                this.selectedAction.input != undefined
            ) {
                for (let element of this.selectedAction.input) {
                    this.actionFields.push({
                        fieldID: element.name,
                        fieldType: element.type,
                        fieldDescription: element.description,
                        fieldValue: '',
                    });
                }
                for (let element of this.selectedAction.labels) {
                    this.actionVariables.push({
                        name: element.name,
                        value: element.value,
                        img_src: this.getimgsrc(this.selectedAction.api_name),
                    });
                }
            }
        }
        if (updateReaction) {
            this.reactionFields = [];
            if (
                this.selectedReaction != undefined &&
                this.selectedReaction.input != undefined
            ) {
                for (let element of this.selectedReaction.input) {
                    this.reactionFields.push({
                        fieldID: element.name,
                        fieldType: element.type,
                        fieldDescription: element.description,
                        fieldValue: '',
                    });
                }
            }
        }
        this.loadValuesFromConfig();
    }

    saveConfiguration() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );

        if (
            this.selectedAction == undefined ||
            this.selectedAction == null ||
            this.selectedReaction == undefined ||
            this.selectedReaction == null
        ) {
            alert(
                'Unable to save configuration, please select the necessary items.'
            );
            return;
        }

        let url: string = window.location.href;
        const searchParams = new URLSearchParams(url.split('?')[1]);
        let URLconfigID = searchParams.get('configID');

        let conf: IUserConfig = {
            id: URLconfigID,
            actions_id: this.selectedAction?.id,
            reaction_id: this.selectedReaction.id,
            headers: { 'Content-Type': 'application/json' },
            method:
                this.selectedAction.api_name.toLowerCase() === 'webhooks'
                    ? 'POST'
                    : 'GET',
            body: { action: [], reaction: [] },
        };
        for (const element of this.actionFields) {
            conf.body.action.push({
                name: element.fieldID,
                value: String(element.fieldValue),
            });
        }
        for (const element of this.reactionFields) {
            conf.body.reaction.push({
                name: element.fieldID,
                value: String(element.fieldValue),
            });
        }
        if (URLconfigID == null || URLconfigID == undefined) {
            this.service.createNewUserConfig(token, conf).subscribe(
                (res) => {
                    if (this.platform.is('desktop')) {
                        location.href = '/dashboard';
                    } else {
                        location.href = '/tabs/home';
                    }
                },
                (err) => {
                    console.error(err);
                }
            );
        } else {
            this.service
                .updateUserConfig(token, conf, Number(URLconfigID))
                .subscribe(
                    (res) => {
                        if (this.platform.is('desktop')) {
                            this.router.navigate(['/dashboard/']);
                        } else {
                            this.router.navigate(['/tabs/home']);
                        }
                    },
                    (err) => {
                        console.error(err);
                    }
                );
        }
    }

    loadValuesFromConfig() {
        if (this.loadedConfig == undefined) return;
        for (const element of this.loadedConfig.body.action) {
            let field = this.actionFields.find(
                (obj) => obj.fieldID == element.name
            );
            if (field == undefined) continue;
            field.fieldValue = element.value;
        }
        for (const element of this.loadedConfig.body.reaction) {
            let field = this.reactionFields.find(
                (obj) => obj.fieldID == element.name
            );
            if (field == undefined) continue;
            field.fieldValue = element.value;
        }
    }

    constructor(
        private router: Router,
        private service: ApiService,
        private route: ActivatedRoute,
        private platform: Platform
    ) {}

    ngOnInit(): void {
        let url: string = window.location.href;
        const searchParams = new URLSearchParams(url.split('?')[1]);
        this.configID = searchParams.get('configID');
        this.actionID = searchParams.get('actionID');
        this.token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        if (!this.token) {
            this.router.navigate(['/home']);
        }
        this.getAllData();
    }
}
