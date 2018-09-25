// imports básicos
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
import { Pro } from '@ionic/pro';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
// plugin para pegar as imagens
import { Camera } from '@ionic-native/camera';
// modulos que mudam o html
import { SuperTabsModule, SuperTabs, SuperTabsController } from 'ionic2-super-tabs';
import { BrMaskerModule } from 'brmasker-ionic-3';
// Storage que guarda se o tutorial foi visto
import { IonicStorageModule } from '@ionic/storage';
// importando o próprio app
import { ConferenceApp } from './app.component';
// providers próprios
import { Servidor } from '../providers/classes/servidor';
import { Interface_usuario } from '../providers/classes/interface';
import { Utilidades } from '../providers/classes/utilidades';
import { Usuario } from '../providers/classes/usuario';
import { Pedido } from '../providers/classes/pedido';
import { FileDealer } from '../providers/classes/file';
// controle de arquivos
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
// páginas
import { ContasPage } from '../pages/contas/contas';
import { SendOrderPage } from '../pages/send-order/send-order';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { LoginPage } from '../pages/user-login/user-login';
import { RegisterPage } from '../pages/register/register';
import { RecuperarSenhaPage } from '../pages/recuperar-senha/recuperar-senha';
import { ShopPage } from '../pages/shop/shop';
import { HistoricPage } from '../pages/historic/historic';
import { AddToCartPage } from '../pages/add-to-cart/add-to-cart';
import { EditarPerfilPage } from '../pages/editar-perfil/editar-perfil';
import { ProfilePage } from '../pages/profile/profile';
import { CartPage } from '../pages/cart/cart';
// módulos das páginas
import { AddToCartPageModule } from '../pages/add-to-cart/add-to-cart.module';
import { CartPageModule } from '../pages/cart/cart.module';
import { ContasPageModule } from '../pages/contas/contas.module';
import { UserLoginModule } from '../pages/user-login/user-login.module';
import { ShopPageModule } from '../pages/shop/shop.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { HistoricPageModule } from '../pages/historic/historic.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { SendOrderPageModule } from '../pages/send-order/send-order.module';
import { RecuperarSenhaPageModule } from '../pages/recuperar-senha/recuperar-senha.module';
import { EditarPerfilPageModule } from '../pages/editar-perfil/editar-perfil.module';
import { Mercado } from '../providers/classes/mercado';
Pro.init('861e9350', 
{
	appVersion: '0.1.2'
})
@Injectable()
export class MyErrorHandler implements ErrorHandler 
{
	ionicErrorHandler: IonicErrorHandler;
	constructor(injector: Injector) 
	{
		try 
		{
			this.ionicErrorHandler = injector.get(IonicErrorHandler);
		} 
		catch(e) 
		{
			// Unable to get the IonicErrorHandler provider, ensure
			// IonicErrorHandler has been added to the providers list below
		}
	}
	handleError(err: any): void 
	{
		Pro.monitoring.handleNewError(err);	
		this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
	}
}
@NgModule({
	declarations: [
		ConferenceApp,
		TutorialPage
	],
	imports: [
		BrowserModule,
		HttpModule,
		HttpClientModule,
		BrMaskerModule,
		RegisterPageModule,
		SuperTabsModule,
		HistoricPageModule,
		UserLoginModule,
		SendOrderPageModule,
		ProfilePageModule,
		EditarPerfilPageModule,
		RecuperarSenhaPageModule,
		TabsPageModule,
		ShopPageModule,
		CartPageModule,
		ContasPageModule,
		AddToCartPageModule,
		IonicModule,
		IonicModule.forRoot(ConferenceApp),
		IonicStorageModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		ConferenceApp,
		LoginPage,
		TabsPage,
		TutorialPage,
		RegisterPage,
		ShopPage,
		ContasPage,
		AddToCartPage,
		CartPage,
		HistoricPage,
		SendOrderPage,
		ProfilePage,
		EditarPerfilPage,
		RecuperarSenhaPage
	],
	providers: [
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		HttpClientModule,
		StatusBar,
		SuperTabsController,
		File,
		FileOpener,
		FileTransfer,
		Camera,
		SuperTabs,
		Servidor,
		Utilidades,
		Usuario,
		Pedido,
		Mercado,
		FileDealer,
		Interface_usuario
	]
})
export class AppModule { }
