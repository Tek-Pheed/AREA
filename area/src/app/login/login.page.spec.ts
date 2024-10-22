import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginPage } from './login.page';
import { ApiService } from 'src/utils/api.services';
import { of, throwError } from 'rxjs';
import { ElementRef } from '@angular/core';

describe('LoginPage', () => {
    let component: LoginPage;
    let fixture: ComponentFixture<LoginPage>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let platformSpy: jasmine.SpyObj<Platform>;

    beforeEach(async () => {
        const apiServiceMock = jasmine.createSpyObj('ApiService', [
            'postAuthLogin',
        ]);
        const routerMock = jasmine.createSpyObj('Router', ['navigate']);
        const platformMock = jasmine.createSpyObj('Platform', ['is']);

        await TestBed.configureTestingModule({
            declarations: [LoginPage],
            imports: [IonicModule.forRoot()],
            providers: [
                { provide: ApiService, useValue: apiServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: Platform, useValue: platformMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;
        apiServiceSpy = TestBed.inject(
            ApiService
        ) as jasmine.SpyObj<ApiService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        platformSpy = TestBed.inject(Platform) as jasmine.SpyObj<Platform>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to dashboard if token exists and platform is desktop', () => {
        spyOn(localStorage, 'getItem').and.returnValue(
            JSON.stringify('dummyToken')
        );
        platformSpy.is.and.returnValue(true);

        component.ngOnInit();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should navigate to home if token exists and platform is not desktop', () => {
        spyOn(localStorage, 'getItem').and.returnValue(
            JSON.stringify('dummyToken')
        );
        platformSpy.is.and.returnValue(false);

        component.ngOnInit();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/home']);
    });

    it('should call postAuthLogin on loginRequest', () => {
        component.emailInput = {
            nativeElement: { value: 'test@example.com' },
        } as ElementRef;
        component.passwordInput = {
            nativeElement: { value: 'password' },
        } as ElementRef;

        apiServiceSpy.postAuthLogin.and.returnValue(
            of({ data: { token: 'dummyToken' } })
        );

        component.loginRequest();

        expect(apiServiceSpy.postAuthLogin).toHaveBeenCalledWith(
            'test@example.com',
            'password'
        );
    });

    it('should handle login success in loginCallback', () => {
        spyOn(localStorage, 'setItem');
        component.emailInput = {
            nativeElement: { value: 'test@example.com' },
        } as ElementRef;
        platformSpy.is.and.returnValue(true);

        component.loginCallback({ data: { token: 'dummyToken' } });

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'Email',
            'test@example.com'
        );
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'Token',
            'dummyToken'
        );
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should handle login error in loginRequest', () => {
        spyOn(console, 'error');
        component.emailInput = {
            nativeElement: { value: 'test@example.com' },
        } as ElementRef;
        component.passwordInput = {
            nativeElement: { value: 'password' },
        } as ElementRef;

        apiServiceSpy.postAuthLogin.and.returnValue(throwError('error'));

        component.loginRequest();

        expect(console.error).toHaveBeenCalledWith('error');
    });
});
