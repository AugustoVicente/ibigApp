// componentes padrão
import { Component } from '@angular/core';
// páginas
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { LoginPage } from '../pages/user-login/user-login';
// provider
import { Usuario } from '../providers/classes/usuario';
export interface PageInterface 
{
	title: string;
	name: string;
	component: any;
	icon: string;
	logsOut?: boolean;
	index?: number;
	tabName?: string;
	tabComponent?: any;
}
@Component({templateUrl: 'app.html'})
export class ConferenceApp 
{
	rootPage: any;
	constructor
	(
		private user: Usuario
	) 
	{
		// se viu o tutorial
		if(localStorage.getItem("hasSeenTutorial")) 
		{
			// se o login e senha foram armazenados
			if(localStorage.getItem("login") && localStorage.getItem("senha"))
			{	
				// recebendo login e senha
				var login = localStorage.getItem("login");
				var senha = localStorage.getItem("senha");
				// fazendo login
				this.user.entrar(login, senha).then((entrada) => 
				{
					// se o login obteve sucesso
					if(entrada == true)
					{
						// redireciona para a página principal
						this.rootPage = TabsPage;
					}
					else
					{
						// faz nada
						return false;
					}
				},(error) =>
				{
					// em caso de erro limpar memória e redireciona para a página de login
					localStorage.clear();
					this.rootPage = LoginPage;
				});
			}
			// se não foranm 
			else
			{
				// redireciona para a página de login
				this.rootPage = LoginPage;
			}
		} 
		// se o tutorial não foi visto
		else 
		{
			// redireciona para a página de tutorial
			this.rootPage = TutorialPage;
		}
	}
}
