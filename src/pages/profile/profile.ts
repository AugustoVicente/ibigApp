import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { App } from 'ionic-angular';
import { LoginPage } from '../user-login/user-login';
import { EditarPerfilPage } from '../editar-perfil/editar-perfil';
import { Interface_usuario } from '../../providers/classes/interface';
import { Utilidades } from '../../providers/classes/utilidades';
import { Usuario } from '../../providers/classes/usuario';
import { FileDealer } from '../../providers/classes/file';
@IonicPage()
@Component({selector: 'page-profile', templateUrl: 'profile.html'})
export class ProfilePage 
{
	constructor
	(
		private app : App,
		private modalCtrl: ModalController,
		private utils : Utilidades,
		private user: Usuario,
		private interface_usuario: Interface_usuario,
		private file: FileDealer
	) {}
	// recebendo dados do perfil e retornando estes dados
	dados_perfil()
	{
		// recebendo os dados do perfil do local storage na posição 0
		var dados = JSON.parse(localStorage.getItem("dados_perfil"))[0];
		// recebendo a data na forma de mostrar
		dados.data_constituicao = this.utils.transforma_to_date(dados.data_constituicao);
		// retornando dados finais
		return dados;
	}
	// deslogando da conta atual
	deslogar()
	{
		var load = this.interface_usuario.load_variavel("Desconectando..");
		load.present();
		// redirecionando para a página de login
		this.app.getRootNav().setRoot(LoginPage).then(()=>
		{
			// limpando a memória local
			localStorage.clear();
			load.dismiss();
		});
	}
	// vai para a página de edição dos dados do perfil
	editar()
	{
		// criando o modal para a tela
		let modal = this.modalCtrl.create(EditarPerfilPage);
		// apresentando o modal
    	modal.present();
	}
	// mudar a imagem do perfil
	editar_imagem()
	{
		// criando função para lidar com o resultado da camera
		var function_resolve = (imageData, context) =>
		{
			// recebendo a nova imagem do perfil
			var dados_imagem = 'data:image/jpeg;base64,' + imageData;
			// fazendo o upload da nova imagem escolhida
			context.user.upload_imagem(dados_imagem, context.dados_perfil().idParceiro).then(enviado =>{}, error =>{});
		}
		// criando função para lidar com o erro da camera
		var function_reject = (context) =>
		{
			// mostrando erro ao usuário
			context.interface_usuario.alerta_padrao("Erro", "Não foi possível abrir a galeria.", ["ok"]);
		}
		// chamando função que abre a camera
		this.file.getPicture(function_resolve, function_reject, this);
	}
}