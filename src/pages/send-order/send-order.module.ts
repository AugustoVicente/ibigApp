import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendOrderPage } from './send-order';

@NgModule({
  declarations: [
    SendOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(SendOrderPage),
  ],
})
export class SendOrderPageModule {}
