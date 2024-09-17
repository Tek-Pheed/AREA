import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ActionsCardsComponent } from '../components/action_cards/actions_cards.components';
import { DashboardCardsComponent } from '../components/dashboard_cards/dashboard_cards.components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, ActionsCardsComponent, DashboardCardsComponent]
})
export class HomePageModule {}
