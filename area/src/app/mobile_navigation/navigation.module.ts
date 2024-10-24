import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { NavigationPageRoutingModule } from './navigation-routing.module';
import { NavigationPage } from './navigation.page';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, NavigationPageRoutingModule],
    declarations: [NavigationPage],
})
export class NavigationPageModule {}