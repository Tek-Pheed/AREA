import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditeurPage } from './editeur.page';

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditeurPageRoutingModule {}