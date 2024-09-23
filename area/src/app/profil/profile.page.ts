import { Component, input } from '@angular/core';

interface ProfileData {
    Name: string;
    Tag: string;
    Email: string;
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
}
