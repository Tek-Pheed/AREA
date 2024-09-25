import { Component } from '@angular/core';

interface activeArea {
    name: string;
    actionAPILogoUrl: string;
    reactionAPILogoUrl: string;
}

@Component({
    selector: 'app-profil',
    templateUrl: 'dashboard.page.html',
    styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage {
    constructor() {}

    data: activeArea[] = [
        {
            name: 'When commit send message on discord channel',
            actionAPILogoUrl: 'assets/samy.jpeg',
            reactionAPILogoUrl: 'assets/samy.jpeg',
        },
        {
            name: 'When commit send message on discord channel',
            actionAPILogoUrl: 'assets/samy.jpeg',
            reactionAPILogoUrl: 'assets/samy.jpeg',
        },
        {
            name: 'When commit send message on discord channel',
            actionAPILogoUrl: 'assets/samy.jpeg',
            reactionAPILogoUrl: 'assets/samy.jpeg',
        },
        {
            name: 'When commit send message on discord channel',
            actionAPILogoUrl: 'assets/samy.jpeg',
            reactionAPILogoUrl: 'assets/samy.jpeg',
        },
    ];
}
