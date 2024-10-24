import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EditeurPage } from './editeur.page';
import { EditeurPageRoutingModule } from './editeur-routing.module';
import { EditorSettingsComponent } from '../components/editor_settings/editor_settings.components';
import { ActionsCardsComponent } from '../components/action_cards/actions_cards.components';
import { EditorSawpSettingsComponent } from '../components/editor_swap_settings/editor_swap_settings.components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditeurPageRoutingModule,
    ActionsCardsComponent,
  ],
  declarations: [EditeurPage, EditorSettingsComponent,EditorSawpSettingsComponent]
})
export class EditeurPageModule {}
