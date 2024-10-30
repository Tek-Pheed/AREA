import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/utils/api.services';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import {
    APIServices,
    IActions,
    IConfigContent,
    IModalFields,
    IModalVariables,
    IReactions,
    IUserConfig,
} from '../utils/data.models';
import { Platform } from '@ionic/angular';
import {
    EditorSettingsComponent,
    EditModalReturnType,
} from '../components/editor_settings/editor_settings.components';
import {
    EditorSawpSettingsComponent,
    SwapModalReturnType,
} from '../components/editor_swap_settings/editor_swap_settings.components';

interface ReactionData {
    raw: IReactions;
    fields: IModalFields[];
}

interface ActionData {
    raw: IActions;
    fields: IModalFields[];
    labels: IModalVariables[];
}

@Component({
    selector: 'app-editeur',
    templateUrl: 'editeur.page.html',
    styleUrls: ['editeur.page.scss'],
})
export class EditeurPage implements OnInit {
    private configID: string | null = '';
    private token: string = '';

    // Available Data
    integrations: APIServices[] = [];
    actions: IActions[] = [];
    reactions: IReactions[] = [];

    loadedConfig: IUserConfig | undefined;
    date = new Date();

    // Config Variables
    configuredAction: ActionData | undefined = undefined;
    configuredReactions: (ReactionData | undefined)[] = [undefined];

    constructor(
        private router: Router,
        private service: ApiService,
        private route: ActivatedRoute,
        private platform: Platform,
        private viewContainerRef: ViewContainerRef,
        private toastController: ToastController
    ) {}

    ngOnInit(): void {
        let url: string = window.location.href;
        const searchParams = new URLSearchParams(url.split('?')[1]);
        this.configID = searchParams.get('configID');
        this.token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        if (!this.token) {
            this.router.navigate(['/home']);
        }
        this.getAllIntegrations();
    }

    selectActionById(id: string | undefined) {
        let action = this.actions.find((elm) => elm.id == Number(id))?.api_name;
        if (action != undefined) {
            if (this.isServiceConnected(action) != true) {
                this.presentToast(
                    10000,
                    `The service ${action} is not connected. This area will not be active until you connect this service.`,
                    'top'
                );
            }
        }

        if (id == undefined || id == '') {
            this.configuredAction = undefined;
            return;
        }
        let rawAction = this.actions.find((a) => a.id == Number(id));
        let actionFields = [];
        let actionLabels = [];
        if (rawAction == undefined) return;
        for (let element of rawAction.input) {
            actionFields.push({
                fieldID: element.name,
                fieldType: element.type,
                fieldDescription: element.description,
                fieldValue: '',
            });
        }
        for (let element of rawAction.labels) {
            actionLabels.push({
                name: element.name,
                value: element.value,
                img_src: this.getimgsrc(rawAction.api_name),
            });
        }
        this.configuredAction = {
            fields: actionFields,
            raw: rawAction,
            labels: actionLabels,
        };
    }

    swapReactionById(
        old_id: string | undefined,
        new_id: string | undefined,
        values: any[] = []
    ) {
        let reaction = this.reactions.find(
            (elm) => elm.id == Number(new_id)
        )?.api_name;
        if (reaction != undefined) {
            if (this.isServiceConnected(reaction) != true) {
                this.presentToast(
                    10000,
                    `The service ${reaction} is not connected. This area will not be active until you connect this service.`,
                    'top'
                );
            }
        }

        let oldReactionIndex = this.configuredReactions.findIndex(
            (a) => a?.raw.id == Number(old_id) || a == old_id
        );
        let rawReaction = this.reactions.find((a) => a.id == Number(new_id));
        let reactionFields = [];
        if (rawReaction == undefined) return;

        if (
            this.configuredReactions.find((obj) => obj?.raw.id == new_id) !=
            undefined
        ) {
            alert('Unable to select the same reaction twice !');
            return;
        }

        if (rawReaction.input != null && values != undefined) {
            for (let element of rawReaction.input) {
                reactionFields.push({
                    fieldID: element.name,
                    fieldType: element.type,
                    fieldDescription: element.description,
                    fieldValue: values.find(
                        (el: any) => el.name == element.name
                    )?.value,
                });
            }
        }
        this.configuredReactions[oldReactionIndex] = {
            fields: reactionFields,
            raw: rawReaction,
        };
    }

    loadValuesFromConfig() {
        if (this.loadedConfig == undefined) return;
        for (const element of this.loadedConfig.body.action) {
            let field = this.configuredAction?.fields.find(
                (obj) => obj.fieldID == element.name
            );
            if (field == undefined) continue;
            field.fieldValue = element.value;
        }
        for (const element of this.loadedConfig.body.reaction) {
            let rfield = this.configuredReactions.find(
                (obj) =>
                    obj?.fields.find((obj) => obj.fieldID == element.name)
                        ?.fieldID == element.name
            );
            if (rfield == undefined) continue;
            let f = rfield.fields.find((obj) => obj.fieldID == element.name);
            if (f != undefined) {
                f.fieldValue = element.value;
            }
        }
    }

    isServiceConnected(api_name: string) {
        let int = this.integrations.find((elm) => elm.name == api_name);

        if (int != undefined) {
            return int.connected;
        } else {
            return false;
        }
    }

    getimgsrc(title: string | undefined) {
        if (title == undefined) return 'assets/question-mark-round-icon.svg';
        let res = this.integrations.find(
            ({ name }) => name === title
        )?.icon_url;
        if (res == undefined) return 'assets/favicon.png';
        return res;
    }
    getAllIntegrations() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getAllServices(token).subscribe(
            (res) => {
                this.integrations = res.data;
                this.integrations.splice(
                    this.integrations.findIndex(
                        (elm) => elm.name.toLowerCase() == 'nexus'
                    ),
                    1
                );
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
                this.getAllActions();
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
                this.actions = res.data;
                this.actions.splice(
                    this.actions.findIndex(
                        (elm) => elm.api_name.toLowerCase() == 'nexus'
                    ),
                    0
                );
                this.getAllReactions();
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
                this.reactions.splice(
                    this.reactions.findIndex(
                        (elm) => elm.api_name.toLowerCase() == 'nexus'
                    ),
                    0
                );
                this.loadConfig();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    async presentToast(
        duration: number = 1500,
        message: string = '',
        position: 'top' | 'middle' | 'bottom'
    ) {
        const toast = await this.toastController.create({
            message: message,
            duration: duration,
            position: position,
            cssClass: 'toast-custom-class',
        });
        await toast.present();
    }

    loadConfig() {
        let url: string = window.location.href;
        this.service.getUserConfigs(this.token).subscribe(
            (res) => {
                if (this.configID != null && this.configID != undefined) {
                    let config: any = res.data.filter(
                        (obj: any) => obj.id == this.configID
                    );
                    const searchParams = new URLSearchParams(url.split('?')[1]);
                    if (config != undefined && config[0] != undefined) {
                        config = config[0];
                        this.loadedConfig = config;
                        this.selectActionById(config.actions_id);

                        if (config.reaction_id == 0) {
                            this.configuredReactions = [];
                            for (const element of config.body.reaction) {
                                let rawreact = this.reactions.find(
                                    (elm) => elm.title == element.reaction
                                );
                                if (rawreact == undefined) continue;
                                let inputs = [];
                                if (
                                    rawreact.input != undefined &&
                                    rawreact.input != null
                                ) {
                                    for (let elm of rawreact.input) {
                                        inputs.push({
                                            fieldID: elm.name,
                                            fieldType: elm.type,
                                            fieldDescription: elm.description,
                                            fieldValue: element.params.find(
                                                (el: any) => el.name == elm.name
                                            )?.value,
                                        });
                                    }
                                }
                                this.configuredReactions.push({
                                    raw: rawreact,
                                    fields: inputs,
                                });
                                element.reaction;
                            }
                        } else {
                            let r = config.body.reaction;
                            if (r != undefined) r = r[0]?.params;
                            this.swapReactionById(
                                undefined,
                                config.reaction_id,
                                r
                            );
                        }
                    } else if (searchParams.get('configID') != null) {
                        alert('Unable to find corresponding user config');
                        if (this.platform.is('desktop')) {
                            this.router.navigate(['/dashboard']);
                        } else {
                            this.router.navigate(['/tabs/home']);
                        }
                    }
                }
                const searchParams = new URLSearchParams(url.split('?')[1]);
                let actionID = searchParams.get('actionID');
                let reactionID = searchParams.get('reactionID');
                console.warn(this.integrations);

                if (actionID != undefined) {
                    this.selectActionById(actionID);
                }
                if (reactionID != undefined) {
                    this.swapReactionById(undefined, reactionID);
                }

                this.loadValuesFromConfig();
            },
            (err) => {
                console.error(err);
            }
        );
    }

    openModalConfigureAction(action: ActionData | undefined) {
        if (action == undefined) return;
        let component = this.viewContainerRef.createComponent(
            EditorSettingsComponent
        );
        component.setInput('headerProperties', {
            name: action.raw.api_name,
            description: action.raw.description,
            img_src: this.getimgsrc(action.raw.api_name),
        });
        let i = 0;
        for (let element of action.fields) {
            action.fields[i].fieldValue =
                element.fieldType == 'datetime' && element.fieldValue == ''
                    ? this.date.toISOString()
                    : action.fields[i].fieldValue;
            i++;
        }
        component.setInput('fields', action.fields);
        component.setInput('context', component);
        component.setInput('id', action.raw.id);
        component.instance.onModalClose.subscribe(this.actionEditModalClosed);
        component.instance.isOpen = true;
    }

    actionEditModalClosed(data: EditModalReturnType) {
        if (data == undefined || data.fields.length == 0) {
            data.modal?.destroy();
            return;
        }
        if (this.configuredAction != undefined)
            this.configuredAction.fields = data.fields;
        data.modal?.destroy();
    }

    openModalSwapAction(action: ActionData | undefined) {
        let component = this.viewContainerRef.createComponent(
            EditorSawpSettingsComponent
        );
        component.setInput(
            'services',
            this.integrations.filter((elm) => elm.connected)
        );
        component.setInput(
            'areas',
            this.actions.filter((elm) => this.isServiceConnected(elm.api_name))
        );
        component.setInput('context', component);
        component.setInput('id', action?.raw.id);
        component.instance.onModalClose.subscribe(
            this.actionSwapModalClosed.bind(this)
        );
        component.instance.isOpen = true;
    }

    actionSwapModalClosed(data: SwapModalReturnType) {
        if (data == undefined || data.newId == undefined) {
            data.modal?.destroy();
            return;
        }
        this.selectActionById(data.newId);
        data.modal?.destroy();
    }

    openModalConfigureReaction(reaction: ReactionData | undefined) {
        if (reaction == undefined) return;
        let component = this.viewContainerRef.createComponent(
            EditorSettingsComponent
        );
        component.setInput('headerProperties', {
            name: reaction.raw.api_name,
            description: reaction.raw.description,
            img_src: this.getimgsrc(reaction.raw.api_name),
        });
        let i = 0;
        for (let element of reaction.fields) {
            reaction.fields[i].fieldValue =
                element.fieldType == 'datetime' && element.fieldValue == ''
                    ? this.date.toISOString()
                    : reaction.fields[i].fieldValue == undefined
                      ? ''
                      : reaction.fields[i].fieldValue;
            i++;
        }
        component.setInput('fields', reaction.fields);
        component.setInput('context', component);
        component.setInput('id', reaction.raw.id);
        component.setInput('variables', this.configuredAction?.labels);
        component.instance.onModalClose.subscribe(
            this.reactionEditModalClosed.bind(this)
        );
        component.instance.isOpen = true;
    }

    reactionEditModalClosed(data: EditModalReturnType) {
        if (data == undefined || data.fields.length == 0) {
            data.modal?.destroy();
            return;
        }
        let react = this.configuredReactions.find(
            (obj) => obj?.raw.id == Number(data.id)
        );
        if (react != undefined) react.fields = data.fields;
        data.modal?.destroy();
    }

    openModalSwapReaction(reaction: ReactionData | undefined) {
        let component = this.viewContainerRef.createComponent(
            EditorSawpSettingsComponent
        );
        component.setInput(
            'services',
            this.integrations.filter((elm) => elm.connected)
        );
        component.setInput(
            'areas',
            this.reactions.filter((elm) =>
                this.isServiceConnected(elm.api_name)
            )
        );
        component.setInput('context', component);
        component.setInput('id', reaction?.raw.id);
        component.instance.onModalClose.subscribe(
            this.reactionSwapModalClosed.bind(this)
        );
        component.instance.isOpen = true;
    }

    reactionSwapModalClosed(data: SwapModalReturnType) {
        if (data == undefined || data.newId == undefined) {
            data.modal?.destroy();
            return;
        }
        this.swapReactionById(data.id, data.newId);
        data.modal?.destroy();
    }

    addNewReaction() {
        this.configuredReactions.push(undefined);
    }

    deleteReactionById(id: number | undefined) {
        let rindex = this.configuredReactions.findIndex(
            (obj) => obj?.raw.id == id
        );
        if (rindex == -1) return;
        if (confirm('Delete this reaction ?'))
            this.configuredReactions.splice(rindex, 1);
    }

    saveConfiguration() {
        if (
            this.configuredAction == undefined ||
            this.configuredAction.raw == undefined ||
            this.configuredReactions.length <= 0 ||
            this.configuredReactions.find((obj) => obj == undefined) !=
                undefined
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
            actions_id: this.configuredAction.raw?.id,
            reaction_id:
                this.configuredReactions.length > 1
                    ? 0
                    : Number(this.configuredReactions[0]?.raw.id),
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
            body: { action: [], reaction: [] },
        };
        for (const element of this.configuredAction.fields) {
            conf.body.action.push({
                name: element.fieldID,
                value: String(element.fieldValue),
                reaction: undefined,
            });
        }
        for (const reaction of this.configuredReactions) {
            if (reaction == undefined) continue;
            let params: IConfigContent[] = [];
            for (let element of reaction.fields) {
                params.push({
                    name: element.fieldID,
                    value: String(element.fieldValue),
                });
            }
            if (this.configuredReactions.length > 1) {
                conf.body.reaction.push({
                    reaction: reaction?.raw.title,
                    params: params,
                });
            } else {
                conf.body.reaction = params;
            }
        }
        if (URLconfigID == null || URLconfigID == undefined) {
            this.service.createNewUserConfig(this.token, conf).subscribe(
                (res) => {
                    if (this.platform.is('desktop')) {
                        location.href = '/dashboard';
                    } else {
                        location.href = '/tabs/home';
                    }
                },
                (err) => {
                    console.error(err);
                    alert(
                        'Unable to save the configuration: ' + err.error.message
                    );
                }
            );
        } else {
            this.service
                .updateUserConfig(this.token, conf, Number(URLconfigID))
                .subscribe(
                    (res) => {
                        if (this.platform.is('desktop')) {
                            window.location.href = '/dashboard/';
                        } else {
                            window.location.href = '/tabs/home';
                        }
                    },
                    (err) => {
                        console.error(err);
                        alert(
                            'Unable to save the configuration: ' +
                                err.error.message
                        );
                    }
                );
        }
    }
}
