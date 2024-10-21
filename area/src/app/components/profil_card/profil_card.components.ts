import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../utils/api.services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profil-card',
    templateUrl: 'profil_card.components.html',
    styleUrls: ['profil_card.components.scss'],
})
export class ProfilCardComponent implements OnInit {
    @Input() name: string = '';
    @Input() email: string = '';
    @Input() username: string = '';
    @Input() creationDate: string = '';
    @Input() background_color: string = '';
    @Input() image: string = '';

    @Output('onImageChanges') onImageChanges = new EventEmitter<any>();

    inputName: string = '';
    inputEmail: string = '';
    inputPassword: string = '';

    token: string = '';

    constructor(
        private service: ApiService,
        private router: Router
    ) {}

    ngOnInit() {
        this.token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getUserData(this.token).subscribe((res) => {
            this.inputName = res.data[0].username;
            this.inputEmail = res.data[0].email;
        });
    }

    updateName(event: any) {
        this.inputName = event.target.value;
    }

    updateEmail(event: any) {
        this.email = event.target.value;
    }

    updatePassword(event: any) {
        this.inputPassword = event.target.value;
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/home']);
    }

    applyChanges() {
        let body: any = {
            username: this.inputName,
            email: this.inputEmail,
            password: this.inputPassword,
            picture_url: this.image,
        };

        if (body.password.length > 0 && body.password.length < 12) {
            alert(
                "Your password can't be update (password required length of 12 chars) ! But other information was updated"
            );
        }

        this.service.updateCurrentUser(this.token, body).subscribe(
            (res) => {
                localStorage.setItem('Token', res.data.access_token);
                window.location.reload();
            },
            (err) => {
                alert('Error when update account');
            }
        );
    }

    changeImage() {
        let url = prompt('Url of an image: ');

        if (url != null) {
            if (url.length > 2500) {
                alert('The url is too long, please try again');
                return;
            }
            this.image = url;
        }
    }
}
