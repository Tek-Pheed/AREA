import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.components.html',
    styleUrls: ['navbar.components.scss'],
})
export class NavbarComponent implements OnInit {
    profileImage: string = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

    token: string = '';

    constructor(private service: ApiService) {}

    ngOnInit(): void {
        this.token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getUserData(this.token).subscribe((res) => {
            this.profileImage = res.data[0].picture_url;
        });
    }
}
