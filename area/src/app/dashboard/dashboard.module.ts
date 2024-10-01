import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DashboardPage } from './dashboard.page';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardCardsComponent } from '../components/dashboard_cards/dashboard_cards.components';
import { IntegrationsPageModule } from '../integrations/integrations.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DashboardPageRoutingModule,
        IntegrationsPageModule,
    ],
    declarations: [DashboardPage, DashboardCardsComponent],
})
export class DashboardPageModule {}
