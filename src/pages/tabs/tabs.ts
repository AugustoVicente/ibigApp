import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { ShopPage } from '../shop/shop';
import { HistoricPage } from '../historic/historic';
import { ContasPage } from '../contas/contas';
@IonicPage()
@Component({selector: 'page-tabs', templateUrl: 'tabs.html'})
export class TabsPage 
{
	// roots das páginas
	profileRoot : any = ProfilePage;
	shopRoot : any = ShopPage;
	historicRoot : any = HistoricPage;
	contasRoot : any = ContasPage;
}
