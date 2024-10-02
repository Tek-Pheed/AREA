import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
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

    focusedElement: any;

    @Input('headerProperties') properties: IHeaderProperties = {
        img_src: '',
        name: '',
        description: '',
    };

    @Input('fields') fields: IModalFields[] = [];

    @Input('variables') variables: IModalVariables[] = [];

    @Input('isOpen') isOpen: boolean = false;
    @Output('onModalClose') onModalClose = new EventEmitter<IModalFields[]>();

    setFocusElement(element: any) {
        this.focusedElement = element.target;
    }

    addVariableToField(variable: string) {
        if (this.focusedElement != undefined)
            this.focusedElement.value += `{{${variable}}}`;
    }

    confirm() {
        this.onModalClose.emit(this.fields);
        this.isOpen = false;
        this.modal?.dismiss(this.fields, 'confirm');
    }

    constructor() {}
}
