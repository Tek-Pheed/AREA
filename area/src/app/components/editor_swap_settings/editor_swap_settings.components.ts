import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { IonicModule, IonModal } from '@ionic/angular';
import {
    IActions,
    IReactions,
    IApi,
    APIServices,
} from 'src/app/utils/data.models';
import { CommonModule } from '@angular/common';
import { ActionsCardsCompactComponent } from '../action_cards_compact/actions_cards_compact.components';

@Component({
    selector: 'editor-swap-settings',
    templateUrl: 'editor_swap_settings.components.html',
    styleUrls: ['editor_swap_settings.components.scss'],
})
export class EditorSawpSettingsComponent {
    @ViewChild(IonModal) modal: IonModal | undefined;

    selectedElementID: string = '';

    @Input('services') services: APIServices[] = [];
    @Input('areas') areas: IActions[] | IReactions[] = [];

    @Input('isOpen') isOpen: boolean = false;
    @Output('onModalClose') onModalClose = new EventEmitter<
        string | undefined
    >();

    actionResults: IActions[] = [];
    inSearch: boolean = false;
    searchText: string = '';

    handleInput(event: any) {
        const query = event.target.value.toLowerCase();
        this.searchText = query;
        if (query.length > 0) {
            this.inSearch = true;
        } else {
            this.inSearch = false;
        }
        this.actionResults = this.areas.filter(
            (d) =>
                d.title.toLowerCase().indexOf(query) > -1 ||
                d.api_name.toLowerCase().indexOf(query) > -1
        );
    }

    getimgsrc(title: string) {
        let res = this.services.find(({ name }) => name === title)?.icon_url;
        if (res == undefined) return 'assets/favicon.png';
        return res;
    }

    cancel() {
        this.isOpen = false;
        this.modal?.dismiss(null, 'cancel');
    }

    confirm(id: string) {
        this.selectedElementID = id;
        this.onModalClose.emit(this.selectedElementID);
        this.isOpen = false;
        this.modal?.dismiss(this.selectedElementID, 'confirm');
    }

    constructor() {}
}
