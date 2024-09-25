import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { AppConnectedCardComponent } from '../components/application_connection/app-connection.components';
import { ApiService } from 'src/utils/api.services';

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
