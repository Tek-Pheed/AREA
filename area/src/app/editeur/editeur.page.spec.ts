import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditeurPage } from './editeur.page';
import { Router } from '@angular/router';
import { ApiService } from 'src/utils/api.services';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Platform } from '@ionic/angular';

describe('EditeurPage', () => {
    let component: EditeurPage;
    let fixture: ComponentFixture<EditeurPage>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
    let platformSpy: jasmine.SpyObj<Platform>;

    beforeEach(async () => {
        const apiServiceMock = jasmine.createSpyObj('ApiService', [
            'getAllServices',
            'getActions',
            'getReactions',
            'getUserConfigs',
            'createNewUserConfig',
            'updateUserConfig',
        ]);
        const routerMock = jasmine.createSpyObj('Router', ['navigate']);
        const activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', [], {
            snapshot: { paramMap: { get: () => '123' } },
        });
        const platformMock = jasmine.createSpyObj('Platform', ['is']);

        await TestBed.configureTestingModule({
            declarations: [EditeurPage],
            providers: [
                { provide: ApiService, useValue: apiServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: Platform, useValue: platformMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditeurPage);
        component = fixture.componentInstance;
        apiServiceSpy = TestBed.inject(
            ApiService
        ) as jasmine.SpyObj<ApiService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        activatedRouteSpy = TestBed.inject(
            ActivatedRoute
        ) as jasmine.SpyObj<ActivatedRoute>;
        platformSpy = TestBed.inject(Platform) as jasmine.SpyObj<Platform>;

        apiServiceSpy.getAllServices.and.returnValue(of({ data: [] }));
        apiServiceSpy.getActions.and.returnValue(of({ data: [] }));
        apiServiceSpy.getReactions.and.returnValue(of({ data: [] }));
        apiServiceSpy.getUserConfigs.and.returnValue(of({ data: [] }));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to home if no token is found', () => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        component.ngOnInit();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should call getAllData on init', () => {
        spyOn(component, 'getAllData');
        component.ngOnInit();
        expect(component.getAllData).toHaveBeenCalled();
    });

    it('should open action modal with correct properties', () => {
        component.selectedAction = {
            api_name: 'test',
            description: 'test description',
            id: 1,
            input: [],
            title: 'test title',
            ask_url: 'test_url',
            labels: [],
        };
        component.openActionModal();
        expect(component.actionModalShow).toBeTrue();
        expect(component.actionProperties.name).toBe('test');
        expect(component.actionProperties.description).toBe('test description');
    });

    it('should open reaction modal with correct properties', () => {
        component.selectedReaction = {
            api_name: 'test',
            description: 'test description',
            id: 1,
            input: [],
            title: 'test title',
            ask_url: 'test_url',
            labels: [],
        };
        component.openReactionModal();
        expect(component.reactionModalShow).toBeTrue();
        expect(component.reactionProperties.name).toBe('test');
        expect(component.reactionProperties.description).toBe(
            'test description'
        );
    });

    it('should close action modal and update fields', () => {
        const data = [
            {
                fieldID: '1',
                fieldValue: 'value',
                fieldDescription: 'description',
                fieldType: 'type',
            },
        ];
        component.actionModalClosed(data);
        expect(component.actionModalShow).toBeFalse();
        expect(component.actionFields).toEqual(data);
    });

    it('should close reaction modal and update fields', () => {
        const data = [
            {
                fieldID: '1',
                fieldValue: 'value',
                fieldDescription: 'description',
                fieldType: 'type',
            },
        ];
        component.reactionModalClose(data);
        expect(component.reactionModalShow).toBeFalse();
        expect(component.reactionFields).toEqual(data);
    });

    it('should swap action and update actionID', () => {
        component.swapActionSave('123');
        expect(component.actionID).toBe('123');
    });

    it('should swap reaction and update reactionID', () => {
        component.swapReactionSave('123');
        expect(component.reactionID).toBe('123');
    });

    it('should call getAllDatas with correct parameters', () => {
        spyOn(component, 'getAllDatas');
        component.swapActionSave('123');
        expect(component.getAllDatas).toHaveBeenCalledWith(true, false);
    });

    it('should call getAllDatas with correct parameters for reaction', () => {
        spyOn(component, 'getAllDatas');
        component.swapReactionSave('123');
        expect(component.getAllDatas).toHaveBeenCalledWith(false, true);
    });

    it('should load values from config correctly', () => {
        component.loadedConfig = {
            id: '1',
            actions_id: 1,
            reaction_id: 1,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            body: {
                action: [{ name: 'field1', value: 'value1' }],
                reaction: [{ name: 'field2', value: 'value2' }],
            },
        };
        component.actionFields = [
            {
                fieldID: 'field1',
                fieldValue: '',
                fieldDescription: '',
                fieldType: '',
            },
        ];
        component.reactionFields = [
            {
                fieldID: 'field2',
                fieldValue: '',
                fieldDescription: '',
                fieldType: '',
            },
        ];
        component.loadValuesFromConfig();
        expect(component.actionFields[0].fieldValue).toBe('value1');
        expect(component.reactionFields[0].fieldValue).toBe('value2');
    });
});
