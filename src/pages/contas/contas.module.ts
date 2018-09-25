import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContasPage } from './contas';

@NgModule({
  declarations: [
    ContasPage,
  ],
  imports: [
    IonicPageModule.forChild(ContasPage),
  ],
})
export class ContasPageModule {}
