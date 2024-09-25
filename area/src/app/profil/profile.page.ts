import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';

interface ProfileData {
    Name: string;
    Tag: string;
    Email: string;
    ImgSrc: string;
}

interface APIServices {
    name: string;
    connected: boolean;
    imgsrc: string;
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
        Name: 'Samy Nasset',
        Tag: '@itachi84',
        Email: 'samy.nasset@epitech.eu',
        ImgSrc: 'assets/samy.jpeg',
    };

    servicesData: APIServices[] = [
        {
            name: 'Instagram',
            connected: true,
            imgsrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/768px-Instagram_icon.png',
        },
        {
            name: 'Discord',
            connected: false,
            imgsrc: 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/213px-Discord_Logo_sans_texte.svg.png',
        },
    ];

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
