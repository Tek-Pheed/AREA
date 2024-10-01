import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
      path: 'profile',
      loadChildren: () =>
          import(
              './profil/profile.module'
          ).then((m) => m.ProfilePageModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
        import(
            './dashboard/dashboard.module'
        ).then((m) => m.DashboardPageModule),
},
  {
    path: 'integrations',
    loadChildren: () =>
        import(
            './integrations/integrations.module'
        ).then((m) => m.IntegrationsPageModule),
},
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'mobile',
    loadChildren: () => import('./mobile_navigation/navigation.module').then( m => m.NavigationPageModule)
  },
  {
    path: 'editeur',
    loadChildren: () => import('./editeur/editeur.module').then( m => m.EditeurPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
