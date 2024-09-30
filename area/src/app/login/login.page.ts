import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/utils/api.services';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
    @ViewChild('emailInput') emailInput: ElementRef | undefined;
    @ViewChild('passwordInput') passwordInput: ElementRef | undefined;
    constructor(private service: ApiService) {}

    ngOnInit(): void {
        if (
            JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            ) != undefined &&
            JSON.parse(
                JSON.stringify(localStorage.getItem('Token')) as string
            ) != null
        ) {
            window.location.href = '/profile';
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
    }
}
