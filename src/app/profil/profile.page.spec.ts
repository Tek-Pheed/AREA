import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { ApiService } from 'src/utils/api.services';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { of, throwError } from 'rxjs';

describe('ProfilePage', () => {
    let component: ProfilePage;
    let fixture: ComponentFixture<ProfilePage>;
    let apiService: jasmine.SpyObj<ApiService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const apiServiceSpy = jasmine.createSpyObj('ApiService', [
            'getUserData',
            'updateAPILoginTokens',
            'getAllServices',
            'getAllConnections',
        ]);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [ProfilePage],
            providers: [
                { provide: ApiService, useValue: apiServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: Platform, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfilePage);
        component = fixture.componentInstance;
        apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to home if token is not present', () => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        component.ngOnInit();
        expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should get profile data on init', () => {
        const mockToken = 'mockToken';
        const mockEmail = 'mockEmail';
        spyOn(localStorage, 'getItem').and.callFake((key: string) => {
            if (key === 'Token') return mockToken;
            if (key === 'Email') return mockEmail;
            return null;
        });

        const mockResponse = {
            data: [{ email: 'test@example.com', username: 'testuser' }],
        };
        apiService.getUserData.and.returnValue(of(mockResponse));

        component.ngOnInit();

        expect(component.token).toBe(mockToken);
        expect(component.email).toBe(mockEmail);
        expect(apiService.getUserData).toHaveBeenCalledWith(mockToken);
        expect(component.data.Email).toBe('test@example.com');
        expect(component.data.Name).toBe('testuser');
    });

    it('should handle error when getting profile data', () => {
        const mockToken = 'mockToken';
        spyOn(localStorage, 'getItem').and.returnValue(mockToken);

        apiService.getUserData.and.returnValue(throwError('error'));

        spyOn(console, 'error');

        component.ngOnInit();

        expect(apiService.getUserData).toHaveBeenCalledWith(mockToken);
        expect(console.error).toHaveBeenCalledWith('error');
    });

    it('should update API backend', () => {
        const mockToken = 'mockToken';
        const mockEmail = 'mockEmail';
        component.token = mockToken;
        component.email = mockEmail;
        component.current_oauth_api = 'github';
        component.current_access_oauth_token = 'accessToken';
        component.current_refresh_oauth_token = 'refreshToken';

        apiService.updateAPILoginTokens.and.returnValue(of({}));

        component.updateAPIBackend();

        expect(apiService.updateAPILoginTokens).toHaveBeenCalledWith(
            mockToken,
            mockEmail,
            jasmine.any(Object)
        );
    });

    it('should handle error when updating API backend', () => {
        const mockToken = 'mockToken';
        const mockEmail = 'mockEmail';
        component.token = mockToken;
        component.email = mockEmail;
        component.current_oauth_api = 'github';
        component.current_access_oauth_token = 'accessToken';
        component.current_refresh_oauth_token = 'refreshToken';

        apiService.updateAPILoginTokens.and.returnValue(throwError('error'));

        spyOn(console, 'error');

        component.updateAPIBackend();

        expect(apiService.updateAPILoginTokens).toHaveBeenCalledWith(
            mockToken,
            mockEmail,
            jasmine.any(Object)
        );
        expect(console.error).toHaveBeenCalledWith('error');
    });

    it('should get all services', () => {
        const mockToken = 'mockToken';
        component.token = mockToken;

        const mockServicesResponse = {
            data: [
                { name: 'github', connected: false },
                { name: 'spotify', connected: false },
            ],
        };
        const mockConnectionsResponse = {
            data: [
                {
                    githubAccessToken: 'githubToken',
                    spotifyAccessToken: 'spotifyToken',
                    spotifyRefreshToken: 'spotifyRefreshToken',
                },
            ],
        };

        apiService.getAllServices.and.returnValue(of(mockServicesResponse));
        apiService.getAllConnections.and.returnValue(
            of(mockConnectionsResponse)
        );

        component.getAllServices();

        expect(apiService.getAllServices).toHaveBeenCalledWith(mockToken);
        expect(apiService.getAllConnections).toHaveBeenCalledWith(mockToken);
        expect(component.servicesData[0].connected).toBeTrue();
        expect(component.servicesData[1].connected).toBeTrue();
    });

    it('should handle error when getting all services', () => {
        const mockToken = 'mockToken';
        component.token = mockToken;

        apiService.getAllServices.and.returnValue(throwError('error'));

        spyOn(console, 'error');

        component.getAllServices();

        expect(apiService.getAllServices).toHaveBeenCalledWith(mockToken);
        expect(console.error).toHaveBeenCalledWith('error');
    });
});
