import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { NavbarComponent } from '../components/navbar/navbar.components';
import { AppConnectedCardComponent } from '../components/application_connection/app-connection.components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
  ],
  declarations: [ProfilePage, AppConnectedCardComponent]
})
export class ProfilePageModule {}
