import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';

@NgModule({
	declarations: [
		TabsPage,
	],
	imports: [
		IonicPageModule.forChild(TabsPage),
		SuperTabsModule
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TabsPageModule {}
