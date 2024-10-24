import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { HomePage } from './home.page';

describe('HomePage', () => {
    let component: HomePage;
    let fixture: ComponentFixture<HomePage>;
    let platformSpy: jasmine.SpyObj<Platform>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        platformSpy = jasmine.createSpyObj('Platform', ['is']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [HomePage],
            imports: [IonicModule.forRoot()],
            providers: [
                { provide: Platform, useValue: platformSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HomePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to /tabs/home if token exists and platform is not desktop', () => {
        spyOn(localStorage, 'getItem').and.returnValue('{"token":"123"}');
        platformSpy.is.and.returnValue(false);

        component.ngOnInit();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/home']);
    });

    it('should set token if it exists in localStorage', () => {
        const token = '123';
        spyOn(localStorage, 'getItem').and.returnValue(`{"token":"${token}"}`);

        component.ngOnInit();

        expect(component.token).toBe(`{"token":"${token}"}`);
    });

    it('should not navigate if platform is desktop', () => {
        spyOn(localStorage, 'getItem').and.returnValue('{"token":"123"}');
        platformSpy.is.and.returnValue(true);

        component.ngOnInit();

        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should not set token if it does not exist in localStorage', () => {
        spyOn(localStorage, 'getItem').and.returnValue(null);

        component.ngOnInit();

        expect(component.token).toBe('');
    });
});
