import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { IHeaderProperties, IModalFields, IModalVariables } from 'src/app/utils/data.models';

@Component({
    selector: 'editor-settings',
    templateUrl: 'editor_settings.components.html',
    styleUrls: ['editor_settings.components.scss'],
})
export class EditorSettingsComponent{
    @ViewChild(IonModal) modal: IonModal | undefined;

    focusedElement: any;

    @Input('headerProperties') properties: IHeaderProperties = {img_src:'', name:'', description: ''};

    @Input('fields') fields: IModalFields[] = [
        {
            fieldID: '0',
            fieldDescription: 'Name of the track to play',
            fieldType: 'text',
            fieldValue: '',
        },
        {
            fieldID: '0',
            fieldDescription: 'Start play position',
            fieldType: 'number',
            fieldValue: '',
        },
    ];

    @Input('variables') variables: IModalVariables[] = [
        {
            name: 'Name of the commit',
            value: '{{github.commitName}}',
            img_src:
                'https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png',
        },
        {
            name: 'Name of the user',
            value: '{{github.commitUserName}}',
            img_src:
                'https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png',
        },
        {
            name: 'Commit message',
            value: '{{github.commitMessage}}',
            img_src:
                'https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png',
        },
    ];

    @Input('isOpen') isOpen: boolean = false;
    @Output('onModalClose') onModalClose = new EventEmitter<IModalFields[]>();

    cancel() {
        this.onModalClose.emit([]);
        this.isOpen = false;
        this.modal?.dismiss(null, 'cancel');
    }

    setFocusElement(element: any) {
        this.focusedElement = element.target;
        console.warn(element.target);
    }

    addVariableToField(variable: string) {
        this.focusedElement.value += variable;
    }

    confirm() {
        this.onModalClose.emit(this.fields);
        this.isOpen = false;
        this.modal?.dismiss(this.fields, 'confirm');
    }

    constructor() {}
}
