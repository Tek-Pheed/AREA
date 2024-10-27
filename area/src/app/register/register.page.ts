import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import { IonInput, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-Register',
    templateUrl: 'register.page.html',
    styleUrls: ['register.page.scss'],
})
export class RegisterPage implements OnInit {
    @ViewChild('inputName') inputName: IonInput | undefined;
    @ViewChild('inputEmail') inputEmail: IonInput | undefined;
    @ViewChild('inputPassword') inputPassword: IonInput | undefined;
    @ViewChild('inputPassword2') inputPassword2: IonInput | undefined;

    constructor(
        private service: ApiService,
        private platform: Platform,
        private router: Router
    ) {}

    ngOnInit(): void {
        if (
            JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            ) != undefined &&
            JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            ) != null
        ) {
            if (this.platform.is('desktop')) {
                this.router.navigate(['/dashboard']);
            } else {
                this.router.navigate(['/tabs/home']);
            }
        }
    }

    registerUser() {
        let name: string = '';
        let email: string = '';
        let password: string = '';
        let password2: string = '';

        if (this.inputName != undefined && this.inputName.value != undefined)
            name = String(this.inputName.value);
        if (this.inputEmail != undefined && this.inputEmail.value != undefined)
            email = String(this.inputEmail.value);
        if (this.inputPassword != undefined && this.inputPassword.value != undefined)
            password = String(this.inputPassword.value);
        if (this.inputPassword2 != undefined && this.inputPassword2.value != undefined)
            password2 = String(this.inputPassword2.value);

        if (password !== password2) {
            alert('Passwords are not the same !');
            return;
        } else {
            this.service.postAuthRegister(name, email, password).subscribe(
                (res) => {
                    this.registerUserCallback(res);
                },
                (err) => {
                    console.error(err);
                    alert('Unable to create account: ' + err.error.message);
                }
            );
        }
    }

    registerUserCallback(result: any) {
        if (result.error == true) {
            alert('Unable to create account: ' + result.message);
        }
        localStorage.setItem('Token', result.data.token);

        if (this.platform.is('desktop')) {
            this.router.navigate(['/dashboard']);
        } else {
            this.router.navigate(['/tabs/home']);
        }
    }
}
