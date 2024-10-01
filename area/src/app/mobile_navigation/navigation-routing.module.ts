import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationPage } from './navigation.page';

const routes: Routes = [
    {
        path: '',
        component: NavigationPage,
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('../integrations/integrations.module').then(
                        (m) => m.IntegrationsPageModule
                    ),
            },
            {
                path: 'profile',
                loadChildren: () =>
                    import('../integrations/integrations.module').then(
                        (m) => m.IntegrationsPageModule
                    ),
            },
            {
                path: 'integrations',
                loadChildren: () =>
                    import('../integrations/integrations.module').then(
                        (m) => m.IntegrationsPageModule
                    ),
            },
        ],
    },
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NavigationPageRoutingModule {}
