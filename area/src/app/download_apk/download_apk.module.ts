import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DownloadAPKRoutingModule } from './download_apk-routing.module';
import { IntegrationsPageModule } from '../integrations/integrations.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DownloadAPKRoutingModule,
        IntegrationsPageModule,
    ],
    declarations: [],
})
export class DownloadAPKModule {}
