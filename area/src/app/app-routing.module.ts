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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
