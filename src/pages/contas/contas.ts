import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Utilidades } from '../../providers/classes/utilidades';
@IonicPage()
@Component({selector: 'page-contas', templateUrl: 'contas.html'})
export class ContasPage
{
	// estabelecendo a página inicial como a de faturas geradas
	private pagina : string = '0';
	constructor
	(
		private navCtrl: NavController, 
		private utils: Utilidades
	) {}
}
