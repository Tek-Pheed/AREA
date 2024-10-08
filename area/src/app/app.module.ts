import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApiService } from 'src/utils/api.services';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot({
            platform: {
                desktop: (win) => {
                    const isMobile =
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                            win.navigator.userAgent
                        );
                    return !isMobile;
                },
            },
        }),
        AppRoutingModule,
        HttpClientModule,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        ApiService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
