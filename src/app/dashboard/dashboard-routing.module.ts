import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './dashboard.page';
import { IntegrationsPage } from '../integrations/integrations.page';
import { ProfilePage } from '../profil/profile.page';

const routes: Routes = [
    {
        path: '',
        component: DashboardPage,
    },
    {
        path: 'integrations',
        loadChildren: () =>
            import('../integrations/integrations.module').then(
                (m) => m.IntegrationsPageModule
            ),
    },
    {
        path: 'profile',
        loadChildren: () =>
            import('../profil/profile.module').then((m) => m.ProfilePageModule),
    },
    {
        path: 'editor',
        loadChildren: () =>
            import('../editeur/editeur.module').then(
                (m) => m.EditeurPageModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
