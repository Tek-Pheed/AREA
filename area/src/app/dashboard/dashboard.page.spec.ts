import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';
import { ApiService } from 'src/utils/api.services';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DashboardPage', () => {
    let component: DashboardPage;
    let fixture: ComponentFixture<DashboardPage>;
    let apiService: jasmine.SpyObj<ApiService>;

    beforeEach(async () => {
        const apiServiceSpy = jasmine.createSpyObj('ApiService', [
            'getAllServices',
            'getActions',
            'getReactions',
            'getUserConfigs',
        ]);

        await TestBed.configureTestingModule({
            declarations: [DashboardPage],
            providers: [{ provide: ApiService, useValue: apiServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardPage);
        component = fixture.componentInstance;
        apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch APIs on init', () => {
        const mockApis = { data: [{ id: 1, name: 'API1', icon_url: 'url1' }] };
        apiService.getAllServices.and.returnValue(of(mockApis));

        component.ngOnInit();

        expect(apiService.getAllServices).toHaveBeenCalled();
        expect(component.apis).toEqual(mockApis.data);
    });

    it('should handle error when fetching APIs', () => {
        apiService.getAllServices.and.returnValue(throwError('error'));

        component.ngOnInit();

        expect(apiService.getAllServices).toHaveBeenCalled();
        expect(component.apis).toEqual([]);
    });

    it('should filter active areas based on search text', () => {
        component.datas = [
            {
                name: 'Test1',
                actionAPILogoUrl: '',
                reactionAPILogoUrl: '',
                configID: '1',
            },
            {
                name: 'Example2',
                actionAPILogoUrl: '',
                reactionAPILogoUrl: '',
                configID: '2',
            },
        ];
        console.log(component.datas.length);
        component.handleInput({ target: { value: 'test' } });

        expect(component.showActiveArea.length).toBe(1);
        expect(component.showActiveArea[0].name).toBe('Test1');
    });

    it('should generate cards correctly', () => {
        component.userConfigs = [
            {
                id: '1',
                actions_id: 1,
                reaction_id: 2,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    action: [],
                    reaction: [],
                },
            },
        ];
        component.actions = [
            {
                id: 1,
                title: 'Action1',
                api_name: 'API1',
                description: '',
                ask_url: '',
                labels: [],
                input: [],
            },
        ];
        component.reactions = [
            {
                id: 1,
                title: 'Reaction1',
                api_name: 'API2',
                description: '',
                ask_url: '',
                labels: [],
                input: [],
            },
        ];
        component.apis = [
            {
                name: 'API1',
                icon_url: 'url1',
                id: 0,
            },
            {
                name: 'API2',
                icon_url: 'url2',
                id: 1,
            },
        ];
        console.log('component.datas ' + component.datas.length);
        component.generateCards();

        expect(component.datas.length).toBe(1);
        expect(component.datas[0].name).toBe('On action1, reaction1');
    });

    it('should navigate to editor with correct config ID', () => {
        spyOnProperty(location, 'href', 'set');

        component.launchEditor('123');

        expect(location.href).toBe('/editeur?configID=123');
    });

    it('should not navigate to editor if config ID is null', () => {
        spyOnProperty(location, 'href', 'set');

        component.launchEditor(null);

        expect(location.href).toBeUndefined();
    });
});
