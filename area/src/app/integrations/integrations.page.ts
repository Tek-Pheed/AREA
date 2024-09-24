import { Component } from '@angular/core';

interface Integrations {
    name: String;
    iconUrl: String;
}

interface ActionReaction {
    apiName: string,
    description: string,
}

@Component({
    selector: 'app-integration',
    templateUrl: 'integrations.page.html',
    styleUrls: ['integrations.page.scss'],
})
export class IntegrationsPage {
    integrations: Integrations[] = [
        {
            name: 'Coinbase',
            iconUrl:
            'https://seeklogo.com/images/C/coinbase-coin-logo-C86F46D7B8-seeklogo.com.png',
        },
        {
            name: 'Twitch',
            iconUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1vkwHVqqCQ1sF1odRzV_qFB3dGjEaQ_D3zg&s',
        },
        {
            name: 'Spotify',
            iconUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRslcO84eWfXP_4Ucd4Yfz6B8uqJmHaTo0iTw&s',
        },
        {
            name: 'Discord',
            iconUrl:
            'https://cdn.iconscout.com/icon/free/png-256/free-discord-logo-icon-download-in-svg-png-gif-file-formats--social-network-media-pack-logos-icons-3357697.png?f=webp&w=256',
        },
        {
            name: 'Github',
            iconUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Ex7v1n8Y3ahwni4F268cY8gUcV30yO5uCA&s',
        },
        {
            name: 'Google Calandar',
            iconUrl:
            'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-03-512.png',
        },
    ];

    actions: ActionReaction[] = [{apiName: 'X', description: "On tweet"}];

    getIconUrl(apiname: string) {
        let res = this.integrations.find(({ name }) => name === apiname)?.iconUrl;

        console.warn(res);

        if (res == undefined)
            return ("assets/favicon.png");
        return (res);
    }

    constructor() {
    }
}
