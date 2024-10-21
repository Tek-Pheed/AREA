import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import {
    IHeaderProperties,
    IModalFields,
    IModalVariables,
} from 'src/app/utils/data.models';

@Component({
    selector: 'editor-settings',
    templateUrl: 'editor_settings.components.html',
    styleUrls: ['editor_settings.components.scss'],
})
export class EditorSettingsComponent {
    @ViewChild(IonModal) modal: IonModal | undefined;

    focusedElementId: IModalFields | undefined;

    @Input('headerProperties') properties: IHeaderProperties = {
        img_src: '',
        name: '',
        description: '',
    };

    @Input('fields') fields: IModalFields[] = [];

    @Input('variables') variables: IModalVariables[] = [];

    @Input('isOpen') isOpen: boolean = false;
    @Output('onModalClose') onModalClose = new EventEmitter<IModalFields[]>();

    setFocusElement(element: IModalFields) {
        this.focusedElementId = element;
    }

    addVariableToField(variable: string) {
        if (this.focusedElementId != undefined) {
            this.focusedElementId.fieldValue += `{{${variable}}}`;
        }
    }

    confirm() {
        this.onModalClose.emit(this.fields);
        this.isOpen = false;
        this.modal?.dismiss(this.fields, 'confirm');
    }


    @ViewChild('editModal') editModal: IonModal | null = null;
    constructor(private router: Router) {
        this.router.events.subscribe((event: any): void => {
            if (event instanceof NavigationStart) {
                if (event.navigationTrigger === 'popstate') {
                    if (this.editModal != null)
                            this.editModal.dismiss();
                }
            }
        });
    }
}
