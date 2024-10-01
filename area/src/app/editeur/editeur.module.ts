import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EditeurPage } from './editeur.page';
import { EditeurPageRoutingModule } from './editeur-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditeurPageRoutingModule,
  ],
  declarations: [EditeurPage]
})
export class EditeurPageModule {}
