import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    API_URL = localStorage.getItem('api_url')
        ? localStorage.getItem('api_url')
        : environment.API_URL;

    constructor(private http: HttpClient, private platform: Platform) {}

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

    getAllServices(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });
        try {
            return this.http.get<any>(`${this.API_URL}/api/services`, {
                headers,
            });
        } catch (error) {
            console.error('Error:', error);
            return of({
                status: 500,
                error: true,
                message: 'Internal Server Error',
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

    getOAuthCallback(token: string, name: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/${name}/callback`,
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

    getOauthLogin(token: string, name: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(
                `${this.API_URL}/api/oauth/${name}/login`,
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

    getUserConfigs(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(`${this.API_URL}/api/users/configs`, {
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

    getExampleConfigs(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.get<any>(`${this.API_URL}/api/presets`, {
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

    deleteUserConfigs(token: string, id: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });

        try {
            return this.http.delete<any>(
                `${this.API_URL}/api/users/configs/${id}`,
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

    getAllConnections(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });
        try {
            return this.http.get<any>(`${this.API_URL}/api/oauth/connections`, {
                headers,
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

    updateAPILoginTokens(
        token: string,
        email: string,
        body: any
    ): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });
        try {
            return this.http.post<any>(
                `${this.API_URL}/api/oauth/update/${email}`,
                JSON.stringify(body),
                { headers }
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

    updateCurrentUser(token: string, info: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });
        try {
            return this.http.put<any>(
                `${this.API_URL}/api/users/me`,
                JSON.stringify(info),
                { headers }
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

    logoutService(
        token: string,
        email: string,
        service: string
    ): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });
        try {
            return this.http.delete<any>(
                `${this.API_URL}/api/oauth/logout/${service}/${email}`,
                { headers }
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

    createNewUserConfig(token: string, body: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });
        try {
            return this.http.post<any>(
                `${this.API_URL}/api/users/configs`,
                JSON.stringify(body),
                { headers }
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

    updateUserConfig(token: string, body: any, id: number): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });
        try {
            return this.http.put<any>(
                `${this.API_URL}/api/users/configs/${id}`,
                JSON.stringify(body),
                { headers }
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

    getLogs(token: string, email: any, service: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        });
        try {
            return this.http.get<any>(
                `${this.API_URL}/api/logs/${email}/${
                    service == '' ? 'all' : service
                }`,
                { headers }
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

    getAboutJson(): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        try {
            return this.http.get<any>(`${this.API_URL}/about.json`, {
                headers,
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
}
