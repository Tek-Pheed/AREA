import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IntegrationsPage } from './integrations.page';
import { IntegrationsPageRoutingModule } from './integrations-routing.module';
import { NavbarComponent } from '../components/navbar/navbar.components';
import { ActionsCardsCompactComponent } from '../components/action_cards_compact/actions_cards_compact.components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntegrationsPageRoutingModule
  ],
  declarations: [IntegrationsPage, ActionsCardsCompactComponent, NavbarComponent]
})
export class IntegrationsPageModule {}
