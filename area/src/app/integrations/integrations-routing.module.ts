import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationsPage } from './integrations.page';

const routes: Routes = [
  {
    path: '',
    component: IntegrationsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationsPageRoutingModule {}
