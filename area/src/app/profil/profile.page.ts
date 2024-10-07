import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import { APIServices } from '../utils/data.models';
import { ProfileData } from '../utils/data.models';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-profil',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit {
    current_access_oauth_token: string = '';
    current_refresh_oauth_token: string = '';
    current_oauth_api: string = '';

    email: string = '';
    token: string = '';

    constructor(
        private service: ApiService,
        protected platform: Platform
    ) {}

    ngOnInit(): void {
        this.token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.email = JSON.parse(
            JSON.stringify(localStorage.getItem('Email')) as string
        );
        this.getAllServices();
        this.getProfileData();
        let url: string = window.location.href;
        const searchParams = new URLSearchParams(url.split('?')[1]);
        this.current_access_oauth_token = `${searchParams.get('access_token')}`;
        this.current_refresh_oauth_token = `${searchParams.get('refresh_token')}`;
        this.current_oauth_api = `${searchParams.get('api')}`;
    }

    data: ProfileData = {
        Name: 'Name',
        Email: 'email@example.com',
        ImgSrc: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    };

    servicesData: APIServices[] = [];

    loaded: boolean = false;

    getProfileData() {
        this.service.getUserData(this.token).subscribe(
            (res) => {
                this.data.Email = res.data[0].email;
                this.data.Name = res.data[0].username;
                console.error(res.data);
                this.servicesData = res.data;
                this.loaded = true;
                if (this.current_oauth_api.length > 0) {
                    this.updateAPIBackend();
                }
            },
            (err) => {
                console.error(err);
            }
        );
    }

    updateAPIBackend() {
        let body = {
            github: {
                access_token:
                    this.current_oauth_api == 'github'
                        ? this.current_access_oauth_token
                        : undefined,
                refresh_token:
                    this.current_oauth_api == 'github'
                        ? this.current_refresh_oauth_token
                        : undefined,
            },
            twitch: {
                access_token:
                    this.current_oauth_api == 'twitch'
                        ? this.current_access_oauth_token
                        : undefined,
                refresh_token:
                    this.current_oauth_api == 'twitch'
                        ? this.current_refresh_oauth_token
                        : undefined,
            },
            discord: {
                access_token:
                    this.current_oauth_api == 'discord'
                        ? this.current_access_oauth_token
                        : undefined,
                refresh_token:
                    this.current_oauth_api == 'discord'
                        ? this.current_refresh_oauth_token
                        : undefined,
            },
            spotify: {
                access_token:
                    this.current_oauth_api == 'spotify'
                        ? this.current_access_oauth_token
                        : undefined,
                refresh_token:
                    this.current_oauth_api == 'spotify'
                        ? this.current_refresh_oauth_token
                        : undefined,
            },
        };

        this.service
            .updateAPILoginTokens(this.token, this.email, body)
            .subscribe(
                (res) => {
                    this.getAllServices();
                },
                (err) => {
                    console.error(err);
                }
            );
    }

    getAllServices() {
        this.service.getAllServices(this.token).subscribe(
            (res) => {
                this.servicesData = res.data;
            },
            (err) => {
                console.error(err);
            },
            () => {
                this.service.getAllConnections(this.token).subscribe((res) => {
                    let data = res.data[0];
                    for (let i = 0; i < this.servicesData.length; i++) {
                        if (
                            data.githubAccessToken != null &&
                            this.servicesData[i].name.toLowerCase() === 'github'
                        ) {
                            this.servicesData[i].connected = true;
                        }

                        if (
                            data.spotifyAccessToken != null &&
                            data.spotifyRefreshToken != null &&
                            this.servicesData[i].name.toLowerCase() ===
                                'spotify'
                        ) {
                            this.servicesData[i].connected = true;
                        }

                        if (
                            data.twitchAccessToken != null &&
                            data.twitchRefreshToken != null &&
                            this.servicesData[i].name.toLowerCase() === 'twitch'
                        ) {
                            this.servicesData[i].connected = true;
                        }

                        if (
                            data.discordAccessToken != null &&
                            data.discordRefreshToken != null &&
                            this.servicesData[i].name.toLowerCase() ===
                                'discord'
                        ) {
                            this.servicesData[i].connected = true;
                        }
                    }
                });
            }
        );
    }
}
