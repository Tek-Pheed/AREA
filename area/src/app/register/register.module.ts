import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RegisterPageRoutingModule],
    declarations: [RegisterPage],
})
export class LoginPageModule {}
