import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ApiService } from 'src/utils/api.services';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';

describe('RegisterPage', () => {
    let component: RegisterPage;
    let fixture: ComponentFixture<RegisterPage>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let platformSpy: jasmine.SpyObj<Platform>;

    beforeEach(async () => {
        const apiSpy = jasmine.createSpyObj('ApiService', ['postAuthRegister']);
        const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
        const platformSpyObj = jasmine.createSpyObj('Platform', ['is']);

        await TestBed.configureTestingModule({
            declarations: [RegisterPage],
            providers: [
                { provide: ApiService, useValue: apiSpy },
                { provide: Router, useValue: routerSpyObj },
                { provide: Platform, useValue: platformSpyObj },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterPage);
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
        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify('token'));
        platformSpy.is.and.returnValue(true);

        component.ngOnInit();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should navigate to home if token exists and platform is not desktop', () => {
        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify('token'));
        platformSpy.is.and.returnValue(false);

        component.ngOnInit();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/home']);
    });

    it('should alert if passwords do not match', () => {
        spyOn(window, 'alert');
        component.inputPassword = {
            nativeElement: { value: 'password1' },
        } as ElementRef;
        component.inputPassword2 = {
            nativeElement: { value: 'password2' },
        } as ElementRef;

        component.registerUser();

        expect(window.alert).toHaveBeenCalledWith(
            'Passwords are not the same !'
        );
    });

    it('should call postAuthRegister if passwords match', () => {
        component.inputName = {
            nativeElement: { value: 'name' },
        } as ElementRef;
        component.inputEmail = {
            nativeElement: { value: 'email' },
        } as ElementRef;
        component.inputPassword = {
            nativeElement: { value: 'password' },
        } as ElementRef;
        component.inputPassword2 = {
            nativeElement: { value: 'password' },
        } as ElementRef;

        apiServiceSpy.postAuthRegister.and.returnValue(
            of({ data: { token: 'token' } })
        );

        component.registerUser();

        expect(apiServiceSpy.postAuthRegister).toHaveBeenCalledWith(
            'name',
            'email',
            'password'
        );
    });

    it('should handle error from postAuthRegister', () => {
        spyOn(window, 'alert');
        component.inputName = {
            nativeElement: { value: 'name' },
        } as ElementRef;
        component.inputEmail = {
            nativeElement: { value: 'email' },
        } as ElementRef;
        component.inputPassword = {
            nativeElement: { value: 'password' },
        } as ElementRef;
        component.inputPassword2 = {
            nativeElement: { value: 'password' },
        } as ElementRef;

        apiServiceSpy.postAuthRegister.and.returnValue(
            throwError({ error: { message: 'error' } })
        );

        component.registerUser();

        expect(window.alert).toHaveBeenCalledWith(
            'Unable to create account: error'
        );
    });

    it('should navigate to dashboard on successful registration if platform is desktop', () => {
        platformSpy.is.and.returnValue(true);
        component.registerUserCallback({
            error: false,
            data: { token: 'token' },
        });

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should navigate to home on successful registration if platform is not desktop', () => {
        platformSpy.is.and.returnValue(false);
        component.registerUserCallback({
            error: false,
            data: { token: 'token' },
        });

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/home']);
    });

    it('should alert on registration error', () => {
        spyOn(window, 'alert');
        component.registerUserCallback({ error: true, message: 'error' });

        expect(window.alert).toHaveBeenCalledWith(
            'Unable to create account: error'
        );
    });
});
