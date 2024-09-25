import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    API_URL = 'http://localhost:3000';

    constructor(private http: HttpClient) {}

    postAuthLogin(email: string, password: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        try {
            return this.http.post<any>(
                `${this.API_URL}/api/auth/login`,
                JSON.parse(
                    JSON.stringify({
                        email: email,
                        password: password,
                    })
                ),
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    postAuthRegister(
        username: string,
        email: string,
        password: string
    ): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        try {
            return this.http.post<any>(
                `${this.API_URL}/api/auth/register`,
                JSON.parse(
                    JSON.stringify({
                        username: username,
                        email: email,
                        password: password,
                    })
                ),
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Registration error:', error);
            return of({
                status: 500,
                error: true,
                message: 'Internal Server Error during registration',
                data: {},
            });
        }
    }

    getActions(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(`${this.API_URL}/api/actions`, {
                headers: headers,
            });
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getReactions(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(`${this.API_URL}/api/reactions`, {
                headers: headers,
            });
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getUserData(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(`${this.API_URL}/api/users/me`, {
                headers: headers,
            });
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getSpotifyLogin(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/spotify/login`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getSpotifyCallback(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/spotify/callback`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getSpotifyCurrentSong(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/spotify/get_current_song`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getTwitchLogin(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/twitch/login`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getTwitchCallback(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/twitch/callback`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getTwitchFollowings(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/twitch/get_followings`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getDiscordLogin(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/discord/login`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getDiscordCallback(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/discord/callback`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getDiscordInfos(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/discord/get_discord_info`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getGithubLogin(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/github/login`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getGithubCallback(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/github/callback`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }

    getGithubIssues(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/github/get_issues`,
                {
                    headers: headers,
                }
            );
        } catch (error) {
            console.error('Error :', error);
            return of({
                status: 500,
                error: true,
                message: 'Error',
                data: {},
            });
        }
    }
}
