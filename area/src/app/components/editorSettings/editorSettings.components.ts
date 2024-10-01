import { Component, Input, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

interface modalFields {
    fieldID: string;
    fieldDescription: string;
    fieldType: string;
    fieldValue: string;
}

interface headerProperties {
    name: string;
    img_src: string;
}

interface modalVariables {
    name: string;
    img_src: string;
    value: string;
}

@Component({
    selector: 'editor-settings',
    templateUrl: 'editorSettings.components.html',
    styleUrls: ['editorSettings.components.scss'],
})
export class EditorSettingsComponent {
    @ViewChild(IonModal) modal: IonModal | undefined;

    focusedElement: any;

    @Input('headerProperties') properties: headerProperties = {
        name: 'Spotify',
        img_src:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRslcO84eWfXP_4Ucd4Yfz6B8uqJmHaTo0iTw&s',
    };

    @Input('fields') fields: modalFields[] = [
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

    @Input('variables') variables: modalVariables[] = [
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

    cancel() {
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
        this.modal?.dismiss(this.fields, 'confirm');
    }

    constructor() {}
}
