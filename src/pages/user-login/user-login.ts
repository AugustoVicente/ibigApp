import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { RecuperarSenhaPage } from '../recuperar-senha/recuperar-senha';
import { TabsPage } from '../tabs/tabs';
import { Interface_usuario } from '../../providers/classes/interface';
import { Utilidades } from '../../providers/classes/utilidades';
import { Usuario } from '../../providers/classes/usuario';
@IonicPage()
@Component({selector: 'page-user-login', templateUrl: 'user-login.html'})
export class LoginPage 
{
	// variáveis de entrada
	private login : string;
	private senha : string;
	constructor
	(
		private navCtrl: NavController,
		private user: Usuario,
		private utils: Utilidades,
		private interface_usuario: Interface_usuario
	) {}
	// muda para a página de registro
	registrar()
	{
		this.navCtrl.push(RegisterPage);
	}
	// muda para a página de recuperação de senha
	recuperaSenha()
	{
		this.navCtrl.push(RecuperarSenhaPage);
	}
	// faz o login
	entrar()
	{
		// se os campos não estiverem válidos
		if(this.utils.valida_campo(this.login) == true || this.utils.valida_campo(this.senha)== true)
		{
			// avisa o usuário
			this.interface_usuario.toast_padrao('Preencha todos os campos!');
		}
		// se estiver
		else
		{
			// faz o login
			this.user.entrar(this.login, this.senha).then((entrada) => 
			{
				// se entrou
				if(entrada == true)
				{
					// muda para a página inicial
					this.navCtrl.setRoot(TabsPage);
				}
				// se não
				else
				{
					// faz nada
					return false;
				}
			},(error) => {});
		}
	}
}