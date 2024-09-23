import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-profil-card',
    templateUrl: 'profil_card.components.html',
    styleUrls: ['profil_card.components.scss'],
})
export class ProfilCardComponent {
    @Input() name: string = '';
    @Input() username: string = '';
    @Input() background_color: string = '';
    @Input() image: string = '';

    showPassword: boolean = false;
    inputName: string = '';
    inputEmail: string = '';
    inputPassword: string = '';

    constructor() {}

    ngOnInit() {
        this.inputName = this.name;
        this.inputEmail = this.username;
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    applyChanges() {
        this.name = this.inputName;
        this.username = this.inputEmail;
    }
}
