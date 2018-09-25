import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarPerfilPage } from './editar-perfil';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    EditarPerfilPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarPerfilPage),
    BrMaskerModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EditarPerfilPageModule {}
