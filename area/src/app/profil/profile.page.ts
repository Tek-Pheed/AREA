import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import { APIServices } from '../utils/data.models';
import { ProfileData } from '../utils/data.models';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';

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
        protected platform: Platform,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.token = JSON.parse(
            JSON.stringify(localStorage.getItem('Token')) as string
        );
        this.email = JSON.parse(
            JSON.stringify(localStorage.getItem('Email')) as string
        );
        if (!this.token) {
            this.router.navigate(['/home']);
        }
        this.getAllServices();
        this.getProfileData();
    }

    data: ProfileData = {
        Name: 'Name',
        Email: 'email@example.com',
        picture_url:
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        create_at: new Date().toDateString(),
    };

    servicesData: APIServices[] = [];

    getProfileData() {
        this.service.getUserData(this.token).subscribe(
            (res) => {
                this.data.Email = res.data[0].email;
                this.data.Name = res.data[0].username;
                if (
                    res.data[0].picture_url != '' &&
                    res.data[0].picture_url != null
                )
                    this.data.picture_url = res.data[0].picture_url;
                this.data.create_at = new Date(
                    res.data[0].create_at
                ).toLocaleDateString();
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
            google: {
                access_token:
                    this.current_oauth_api == 'google'
                        ? this.current_access_oauth_token
                        : undefined,
                refresh_token:
                    this.current_oauth_api == 'google'
                        ? this.current_refresh_oauth_token
                        : undefined,
            },
            unsplash: {
                access_token:
                    this.current_oauth_api == 'unsplash'
                        ? this.current_access_oauth_token
                        : undefined,
                refresh_token:
                    this.current_oauth_api == 'unsplash'
                        ? this.current_refresh_oauth_token
                        : undefined,
            },
        };

        this.service
            .updateAPILoginTokens(this.token, this.email, body)
            .subscribe(
                (res) => {
                    if (
                        !(
                            this.current_access_oauth_token == 'null' &&
                            this.current_refresh_oauth_token == 'null' &&
                            this.current_oauth_api == 'null'
                        )
                    ) {
                        if (this.platform.is('desktop')) {
                            location.href = '/dashboard/profile';
                        } else {
                            location.href = '/tabs/home/profile';
                        }
                    } else {
                    }
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
                this.servicesData.splice(
                    this.servicesData.findIndex(
                        (elm) => elm.name.toLowerCase() == 'nexus'
                    ),
                    1
                );
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
                            data.googleAccessToken != null &&
                            this.servicesData[i].name.toLowerCase() === 'google'
                        ) {
                            this.servicesData[i].connected = true;
                        }

                        if (
                            data.unsplashAccessToken != null &&
                            this.servicesData[i].name.toLowerCase() ===
                                'unsplash'
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

    changeAPIURL() {
        if (this.platform.is('android') && localStorage.getItem('api_url')) {
            const value = window.prompt(
                `Enter your api url\nDefault url: ${
                    environment.API_URL
                }\nCurrent url: ${localStorage.getItem('api_url')}`,
                localStorage.getItem('api_url')
                    ? `${localStorage.getItem('api_url')}`
                    : environment.API_URL
            );

            if (`${value}`.length !== 0 && value !== null) {
                localStorage.setItem('api_url', `${value}`);
            }
        } else {
            const value = window.prompt(
                `Enter your api url\nDefault url: ${environment.API_URL}`,
                localStorage.getItem('api_url')
                    ? `${localStorage.getItem('api_url')}`
                    : environment.API_URL
            );

            if (`${value}`.length !== 0 && value !== null) {
                localStorage.setItem('api_url', `${value}`);
            }
        }

        this.service.API_URL = localStorage.getItem('api_url')
            ? `${localStorage.getItem('api_url')}`
            : environment.API_URL;
    }
}
