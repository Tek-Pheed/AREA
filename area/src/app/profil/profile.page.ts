import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';

interface ProfileData {
    Name: string;
    Email: string;
    ImgSrc: string;
}

interface APIServices {
    name: string;
    connected: boolean;
    icon_url: string;
}

@Component({
    selector: 'app-profil',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit {
    constructor(private service: ApiService) {}

    ngOnInit(): void {
        this.getAllServices();
        this.getProfileData();
    }

    data: ProfileData = {
        Name: 'Name',
        Email: 'email@example.com',
        ImgSrc: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    };

    servicesData: APIServices[] = [
    ];

    loaded: boolean = false;

    getProfileData() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getUserData(token).subscribe(
            (res) => {
                this.data.Email = res.data[0].email;
                this.data.Name = res.data[0].username;
                console.warn(res.data);
                this.servicesData = res.data;
                this.loaded = true;
            },
            (err) => {
                console.error(err);
            }
        );

    }

    setProfileData() {

    }

    getAllServices() {
        let token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.service.getAllServices(token).subscribe(
            (res) => {
                console.warn(res.data);
                this.servicesData = res.data;
            },
            (err) => {
                console.error(err);
            }
        );
    }
}
