import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NavigationPage } from "./navigation.page";

const routes: Routes = [
  {
    path: '',
    component: NavigationPage,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationPageRoutingModule {}