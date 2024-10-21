import {
    Component,
    OnInit,
    ViewContainerRef,
} from '@angular/core';
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
        private viewContainerRef: ViewContainerRef
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

    swapReactionById(old_id: string | undefined, new_id: string | undefined) {
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

        if (rawReaction.input != null) {
            for (let element of rawReaction.input) {
                reactionFields.push({
                    fieldID: element.name,
                    fieldType: element.type,
                    fieldDescription: element.description,
                    fieldValue: '',
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

        //TODO: Change that too
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
                this.loadConfig();
            },
            (err) => {
                console.error(err);
            }
        );
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

                        //TODO: Here replace with array parsing once backend done
                        this.swapReactionById(undefined, config.reaction_id);
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
                if (actionID != undefined)
                    this.selectActionById(actionID);
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
        component.setInput('services', this.integrations);
        component.setInput('areas', this.actions);
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
        component.setInput('services', this.integrations);
        component.setInput('areas', this.reactions);
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

    saveConfiguration() {}

    //TOFIX: Parse date

    /* 
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
 */
}
