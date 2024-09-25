import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    API_URL = 'http://localhost:3000/';

    constructor(private http: HttpClient) {}

    postAuthLogin(email: string, password: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        try {
            return this.http.post<any>(
                `${this.API_URL}api/auth/login`,
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
            console.error('Login error:', error);
            return of({
                status: 500,
                error: true,
                message: 'Internal Server Error during login',
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
                `${this.API_URL}api/auth/register`,
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

    getAllServices(): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        try {
            return this.http.get<any>(`${this.API_URL}api/oauth/spotify/login`);
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

    getSelfProfile(): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        try {
            return this.http.get<any>(`${this.API_URL}/api/users/me`, {
                headers: headers,
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
}
