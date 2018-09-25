import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { LoginPage } from '../user-login/user-login';
@Component({selector: 'page-tutorial', templateUrl: 'tutorial.html'})
export class TutorialPage
{
	// mostrar o botão de pular o tutorial
	public showSkip = true;
	@ViewChild('slides') slides: Slides;
	constructor
	(
		public navCtrl: NavController
	) {}
	// iniciar o aplicativo
	startApp() 
	{
		// muda de página
		this.navCtrl.push(LoginPage).then(() => 
		{
			// marca o tutorial como lido
			localStorage.setItem('hasSeenTutorial', 'true');
		})
	}
	onSlideChangeStart(slider: Slides) 
	{
		// alterando a visibilidade do botão de pular o tutorial
		this.showSkip = !slider.isEnd();
	}
	// quando a página aparecer
	ionViewWillEnter() 
	{
		// atualizando o slide
		this.slides.update();
	}
}
