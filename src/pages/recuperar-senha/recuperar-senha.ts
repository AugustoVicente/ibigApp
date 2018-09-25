import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Interface_usuario } from '../../providers/classes/interface';
import { Utilidades } from '../../providers/classes/utilidades';
import { Usuario } from '../../providers/classes/usuario';
@IonicPage()
@Component({selector: 'page-recuperar-senha',templateUrl: 'recuperar-senha.html'})
export class RecuperarSenhaPage 
{
	// email informado pelo usuário
	private email : string; 
	constructor
	(
		private navCtrl: NavController, 
		private interface_usuario: Interface_usuario,
		private utils: Utilidades,
		private user: Usuario
	) {}
	// função para recuperar a senha
	recupera()
	{
		// variável que é enviada com parâmetros do webservice
		var dados = [];
		// adicionando parâmetro de email
		dados.push({id:"email",valor:this.email});
		// se email não estiver preenchido
		if(this.utils.valida_campo(this.email) == true)
		{
			// avisa para preencher o campo de email
			this.interface_usuario.toast_padrao('Preencha o campo do e-mail!');
		}
		// se estiver preenchido
		else
		{
			// faz a solicitação de recuperar senha
			this.user.recuperar_senha(dados)
			.then((sucesso) => 
			{
				// se deu certo
				if(sucesso == true)
				{
					// volta a página
					this.navCtrl.pop();
				}
				// senão
				else
				{	
					// faz nada
					return false;
				}
			},(error) => {});
		}
	}
}
