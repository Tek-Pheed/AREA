import {
    Component,
    ComponentRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { IActions, IReactions, APIServices } from 'src/app/utils/data.models';
import { NavigationStart, Router } from '@angular/router';

export interface SwapModalReturnType {
    id: string;
    newId: string | undefined;
    modal: ComponentRef<EditorSawpSettingsComponent> | undefined;
}

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

    @Input('id') id: string = '';
    @Input('context') context:
        | ComponentRef<EditorSawpSettingsComponent>
        | undefined;

    @Input('isOpen') isOpen: boolean = false;
    @Output('onModalClose') onModalClose =
        new EventEmitter<SwapModalReturnType>();

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
        this.onModalClose.emit({
            id: this.id,
            modal: this.context,
            newId: undefined,
        });
        this.modal?.dismiss(null, 'cancel');
    }

    confirm(id: string) {
        this.selectedElementID = id;
        this.onModalClose.emit({
            id: this.id,
            modal: this.context,
            newId: this.selectedElementID,
        });
        this.isOpen = false;
        this.modal?.dismiss(this.selectedElementID, 'confirm');
    }

    @ViewChild('editModal') editModal: IonModal | null = null;
    constructor(private router: Router) {
        this.router.events.subscribe((event: any): void => {
            if (event instanceof NavigationStart) {
                if (event.navigationTrigger === 'popstate') {
                    if (this.editModal != null) this.editModal.dismiss();
                }
            }
        });
    }
}
