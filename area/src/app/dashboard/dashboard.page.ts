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
            actionAPILogoUrl: 'https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png',
            reactionAPILogoUrl: 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg',
        },
        {
            name: 'When @pixlvlr is live play rush E on spotify',
            actionAPILogoUrl: 'https://m.media-amazon.com/images/I/21kRx-CJsUL.png',
            reactionAPILogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/768px-Spotify_logo_without_text.svg.png',
        },
    ];
}
