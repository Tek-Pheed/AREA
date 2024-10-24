import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditeurPage } from './editeur.page';

const routes: Routes = [
    {
        path: '',
        component: EditeurPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditeurPageRoutingModule {}