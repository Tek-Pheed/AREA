import { TestBed, ComponentFixture } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavigationPage } from './navigation.page';
class PlatformMock {
    is(platform: string): boolean {
        return platform === 'desktop';
    }
}

describe('NavigationPage', () => {
    let component: NavigationPage;
    let fixture: ComponentFixture<NavigationPage>;
    let router: Router;
    let platform: Platform;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NavigationPage],
            imports: [IonicModule.forRoot()],
            providers: [
                { provide: Platform, useClass: PlatformMock },
                {
                    provide: Router,
                    useValue: {
                        navigate: jasmine.createSpy('navigate'),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NavigationPage);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        platform = TestBed.inject(Platform);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to /dashboard if platform is desktop', () => {
        spyOn(platform, 'is').and.returnValue(true);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should not navigate to /dashboard if platform is not desktop', () => {
        spyOn(platform, 'is').and.returnValue(false);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(router.navigate).not.toHaveBeenCalled();
    });
});
