import { Component } from '@angular/core';

interface Integrations {
    name: String;
    iconUrl: String;
}

@Component({
    selector: 'app-integration',
    templateUrl: 'integrations.page.html',
    styleUrls: ['integrations.page.scss'],
})
export class IntegrationsPage {
    constructor() {}

    integrations: Integrations[] = [
        {
            name: 'X',
            iconUrl:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdB-EbJVMxRYtNz1i4dn7jOVSfHq-002oe4w&s',
        },
        {
            name: 'Twitch',
            iconUrl:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1vkwHVqqCQ1sF1odRzV_qFB3dGjEaQ_D3zg&s',
        },
        {
            name: 'Spotify',
            iconUrl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/768px-Spotify_logo_without_text.svg.png',
        },
    ];
}
