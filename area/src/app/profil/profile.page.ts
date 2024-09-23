import { Component, input } from '@angular/core';

interface ProfileData {
    Name: string;
    Tag: string;
    Email: string;
    ImgSrc: string;
}

interface APIServices {
    Name: string;
    Connected: boolean;
    ImgSrc: string;
}

@Component({
    selector: 'app-profil',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss'],
})
export class ProfilePage {
    constructor() {}

    data: ProfileData = {
        Name: 'Samy Nasset',
        Tag: '@itachi84',
        Email: 'samy.nasset@epitech.eu',
        ImgSrc: 'assets/samy.jpeg',
    };

    servicesData: APIServices[] = [
        {
            Name: 'Instagram',
            Connected: true,
            ImgSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/768px-Instagram_icon.png',
        },
        {
          Name: 'Discord',
          Connected: false,
          ImgSrc: 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/213px-Discord_Logo_sans_texte.svg.png',
      },
    ];
}
