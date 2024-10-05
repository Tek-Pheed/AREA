import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
    @ViewChild('emailInput') emailInput: ElementRef | undefined;
    @ViewChild('passwordInput') passwordInput: ElementRef | undefined;
    constructor(
        private service: ApiService,
        private platform: Platform
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
                window.location.href = 'dashboard';
            } else {
                window.location.href = '/tabs/home';
            }
        }
    }

    loginRequest() {
        let email: string = '';
        let password: string = '';

        if (this.emailInput?.nativeElement != undefined)
            email = this.emailInput.nativeElement.value;

        if (this.passwordInput?.nativeElement != undefined)
            password = this.passwordInput.nativeElement.value;

        this.service.postAuthLogin(email, password).subscribe(
            (res) => {
                this.loginCallback(res);
            },
            (err) => {
                console.error(err);
            }
        );
    }

    loginCallback(result: any) {
        let email: string;

        if (this.emailInput?.nativeElement != undefined) {
            email = this.emailInput.nativeElement.value;
            localStorage.setItem('Email', email);
        }
        localStorage.setItem('Token', result.data.token);

        if (this.platform.is('desktop')) {
            window.location.href = 'dashboard';
        } else {
            window.location.href = '/tabs/home';
        }
    }
}
