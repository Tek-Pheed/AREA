import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/utils/api.services';

@Component({
    selector: 'app-Register',
    templateUrl: 'register.page.html',
    styleUrls: ['register.page.scss'],
})
export class RegisterPage implements OnInit {
    @ViewChild('inputName') inputName: ElementRef | undefined;
    @ViewChild('inputEmail') inputEmail: ElementRef | undefined;
    @ViewChild('inputPassword') inputPassword: ElementRef | undefined;
    @ViewChild('inputPassword2') inputPassword2: ElementRef | undefined;

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

    registerUser() {
        let name: string = '';
        let email: string = '';
        let password: string = '';
        let password2: string = '';

        if (this.inputName?.nativeElement != undefined)
            name = this.inputName.nativeElement.value;
        if (this.inputEmail?.nativeElement != undefined)
            email = this.inputEmail.nativeElement.value;
        if (this.inputPassword?.nativeElement != undefined)
            password = this.inputPassword.nativeElement.value;
        if (this.inputPassword2?.nativeElement != undefined)
            password2 = this.inputPassword2.nativeElement.value;

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
    }
}
