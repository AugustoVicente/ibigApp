import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { Interface_usuario } from '../../providers/classes/interface';
import { Usuario } from '../../providers/classes/usuario';
@IonicPage()
@Component({selector: 'page-editar-perfil', templateUrl: 'editar-perfil.html'})
export class EditarPerfilPage 
{
	// variável que recebe os dados do pefil armazenados na localstorage e serve de comparação para os valores a serem alterados
	private dados_perfil : any;
	// variáveis que recebem todos os atributos do perfiil
	private id : number;
	private nome_fantasia : string;
	private endereco : string;
	private estado : string;
	private cidade : string;
	private telefone : string;
	private celular : string;
	private razao_social : string;
	private administrador : string;
	constructor
	(
		private interface_usuario: Interface_usuario,
		private user: Usuario,
		private viewCtrl: ViewController
	) 
	{
		// recebendo o perfil armazenado no localstoraage na posição 0
		this.dados_perfil = JSON.parse(localStorage.getItem("dados_perfil"))[0];
		// transferindo todos os atributos para cada variável respectivamente
		this.id = this.dados_perfil.idParceiro;
		this.nome_fantasia = this.dados_perfil.nome_fantasia;
		this.endereco = this.dados_perfil.endereco;
		this.estado = this.dados_perfil.estado;
		this.cidade = this.dados_perfil.cidade;
		this.telefone = this.dados_perfil.telefone;
		this.celular = this.dados_perfil.celular;
		this.razao_social = this.dados_perfil.razao_social;
		this.administrador = this.dados_perfil.administrador;
	}
	// voltar na tela anterior
	close()
	{
		this.viewCtrl.dismiss();
	}
	// Salvar os dados modificados
	salvar()
	{
		// criando a variável de dados que serão enviados
		var dados = [];
		// inserindo o valor do id do perfil 
		dados.push({id:"id",valor:this.id});
		// se os dados tiverem sido modificados, adiciona a variável de envio
		if(this.nome_fantasia !== this.dados_perfil.nome_fantasia)
		{
			dados.push({id:"nome_fantasia",valor:this.nome_fantasia});
		}
		if(this.endereco !== this.dados_perfil.endereco)
		{
			dados.push({id:"endereco",valor:this.endereco});
		}
		if(this.telefone !== this.dados_perfil.telefone)
		{
			dados.push({id:"telefone",valor:this.telefone});
		}
		if(this.estado !== this.dados_perfil.estado)
		{
			dados.push({id:"estado",valor:this.estado});
		}
		if(this.cidade !== this.dados_perfil.cidade)
		{
			dados.push({id:"cidade",valor:this.cidade});
		}
		if(this.celular !== this.dados_perfil.celular)
		{
			dados.push({id:"celular",valor:this.celular});
		}
		if(this.razao_social !== this.dados_perfil.razao_social)
		{
			dados.push({id:"razao_social",valor:this.razao_social});
		}
		if(this.administrador !== this.dados_perfil.administrador)
		{
			dados.push({id:"administrador",valor:this.administrador});
		}		
		// enviando a os dados
		this.user.edita_perfil(dados).then(sucesso => 
		{
			// se der certo, busca novamente os dados com os dados alterados
			this.user.busca_info_parceiro(localStorage.getItem("login")).then(sucesso =>
			{
				// volta a página e mostra confirmação ao usuário
				this.viewCtrl.dismiss();
				this.interface_usuario.toast_padrao('Dados alterados com sucesso!');
			},error => {});
		},erro => {});
	}
}