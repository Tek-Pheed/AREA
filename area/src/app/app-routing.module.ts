import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () =>
            import('./home/home.module').then((m) => m.HomePageModule),
    },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./dashboard/dashboard.module').then(
                (m) => m.DashboardPageModule
            ),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./dashboard/dashboard.module').then(
                (m) => m.DashboardPageModule
            ),
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./login/login.module').then((m) => m.LoginPageModule),
    },
    {
        path: 'register',
        loadChildren: () =>
            import('./register/register.module').then(
                (m) => m.RegisterPageModule
            ),
    },
    {
        path: 'tabs',
        loadChildren: () =>
            import('./mobile_navigation/navigation.module').then(
                (m) => m.NavigationPageModule
            ),
    },
    {
        path: 'client.apk',
        loadChildren: () =>
            import('./download_apk/download_apk.module').then(
                (m) => m.DownloadAPKModule
            ),
    },
    {
        path: 'about.json',
        loadChildren: () =>
            import('./about/about.page.module').then((m) => m.AboutPageModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
