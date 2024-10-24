import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import { IonInput, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
    @ViewChild('emailInput') emailInput: IonInput | undefined;
    @ViewChild('passwordInput') passwordInput: IonInput | undefined;
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

    loginRequest() {
        let email: string = '';
        let password: string = '';

        if (this.emailInput != undefined && this.emailInput.value != undefined)
            email = String(this.emailInput.value);
        if (this.passwordInput != undefined && this.passwordInput.value != undefined)
            password = String(this.passwordInput.value);
        this.service.postAuthLogin(email, password).subscribe(
            (res) => {
                this.loginCallback(res);
            },
            (err) => {
                alert("Unable to open your session: " + err.error.message);
                console.error(err);
            }
        );
    }

    loginCallback(result: any) {
        let email: string;

        if (this.emailInput != undefined && this.emailInput.value != undefined) {
            email = String(this.emailInput.value);
            localStorage.setItem('Email', email);
        }
        localStorage.setItem('Token', result.data.token);
        if (this.platform.is('desktop')) {
            this.router.navigate(['/dashboard']);
        } else {
            this.router.navigate(['/tabs/home']);
        }
    }
}
