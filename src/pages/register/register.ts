import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Interface_usuario } from '../../providers/classes/interface';
import { Utilidades } from '../../providers/classes/utilidades';
import { Usuario } from '../../providers/classes/usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
@IonicPage()
@Component({selector: 'page-register', templateUrl: 'register.html'})
export class RegisterPage 
{
	// variáveis que recebem os dados do usuário
	private razao_soc : string;
	private nome_fantasia : string;
	private estado : string;
	private cidade : string;
	private endereco : string;
	private nome : string;
	private cnpj : string;
	private cnpj_buscado : string;
	private compra_mensal : string;
	private media_venda : string;
	private tel : string;
	private email : string;
	private senha : string;
	private csenha : string; // confirmação de senha
	private cel : string;
	// recebendo a data atual em formato de string
	private data_const : string = new Date().toISOString();
	constructor
	(
		private navCtrl: NavController,
		private interface_usuario: Interface_usuario,
		private utils: Utilidades,
		public http: HttpClient,
		private user: Usuario
	) {}
	// função que registra o novo usuário
	register()
	{
		// recebendo resultado de validação dos dados
		var valida_dados = this.checar();
		// se os dados estiverem validados
		if(valida_dados === true)
		{
			// cria variável que recebe os dados de parâmetros para enviar ao webservice
			var dados = [];
			dados.push({id:"razao",valor:this.razao_soc});
			dados.push({id:"nomefantasia",valor:this.nome_fantasia});
			dados.push({id:"estado",valor:this.estado});
			dados.push({id:"cidade",valor:this.cidade});
			dados.push({id:"endereco",valor:this.endereco});
			dados.push({id:"administrador",valor:this.nome});
			dados.push({id:"dataconstituicao",valor:this.data_const});
			dados.push({id:"cnpj",valor:this.cnpj});
			dados.push({id:"compramensal",valor:this.compra_mensal});
			dados.push({id:"media_venda",valor:this.media_venda});
			dados.push({id:"telefone",valor:this.tel});
			dados.push({id:"email",valor:this.email});
			dados.push({id:"senha",valor:this.senha});
			dados.push({id:"celular",valor:this.cel});
			// enviando solicitação de registro
			this.user.registrar(dados).then((resultado) => 
			{
				// se o resultado for verdadeiro
				if(resultado == true)
				{
					// volta a página
					this.navCtrl.pop();
				}
			},(erro) => {});
		}
		// se não estiver válido
		else
		{
			// mostra mensagem de erro
			this.interface_usuario.alerta_padrao("Erro", valida_dados, ['Ok']);
		}
	}
	// checa se os dados são válidos
	checar()
	{
		// se o cnpj não for validado
		if(this.valida_cnpj(this.cnpj) === false)
		{
			return 'CNPJ inválido!';
		}
		// checando se os campos estão preenchidos
		else if(this.cnpj_buscado != this.cnpj)
		{
			return 'O CNPJ informado não é compatível com o buscado!';
		}
		// checando se os campos estão preenchidos
		else if(this.utils.valida_campo(this.razao_soc))
		{
			return 'Preencha o campo de razão social!';
		}
		else if(this.utils.valida_campo(this.nome_fantasia))
		{
			return 'Preencha o campo de nome fantasia!';
		}
		else if(this.utils.valida_campo(this.estado))
		{
			return 'Preencha o campo de estado!';
		}
		else if(this.utils.valida_campo(this.cidade))
		{
			return 'Preencha o campo de cidade!';
		}
		else if(this.utils.valida_campo(this.endereco))
		{
			return 'Preencha o campo de endereço!';
		}
		else if(this.utils.valida_campo(this.nome))
		{
			return 'Preencha o campo do nome do administrador!';
		}
		else if(this.utils.valida_campo(this.data_const))
		{
			return 'Preencha o campo de data de constituição!';
		}
		else if(this.utils.valida_campo(this.cnpj))
		{
			return 'Preencha o campo de CNPJ!';
		}
		else if(this.utils.valida_campo(this.compra_mensal))
		{
			return 'Preencha o campo da quantidade estimada de compras mensais!';
		}
		else if(this.utils.valida_campo(this.media_venda))
		{
			return 'Preencha o campo da quantidade estimada de media de vendas!';
		}
		else if(this.utils.valida_campo(this.tel))
		{
			return 'Preencha o campo de telefone!';
		}
		else if(this.utils.valida_campo(this.cel))
		{
			return 'Preencha o campo de celular!';
		}
		else if(this.utils.valida_campo(this.email))
		{
			return 'Preencha o campo de e-mail!';
		}
		else if(this.utils.valida_campo(this.senha))
		{
			return 'Preencha o campo da senha!';
		}
		else if(this.utils.valida_campo(this.csenha))
		{
			return 'Preencha o campo de confirmação da senha!';
		}
		// se senha e a confirmação de senha não forem correspondidas
		else if(this.csenha !== this.senha)
		{
			return 'As senhas não são compatíveis!';
		}
		// se não houver nenhum problema, retorna true
		else
		{
			return true;
		}
	}
	// checa se o cnpj é valido
	valida_cnpj(cnpj)
	{
		// retirando os caracteres especiais da mascara do cnpj
		cnpj = cnpj.replace(".", "");
		cnpj = cnpj.replace(".", "");
		cnpj = cnpj.replace("/", "");
		cnpj = cnpj.replace("-", "");
		// primeira validação
		if ((cnpj == null) || (cnpj.length != 14) || (cnpj === '00000000000') || (cnpj == '11111111111') || (cnpj == '22222222222') || 
		(cnpj == '33333333333') || (cnpj == '44444444444') || (cnpj == '55555555555') || (cnpj == '66666666666') || (cnpj == '77777777777') || 
		(cnpj == '88888888888') || (cnpj == '99999999999')) 
		{
            return false;
		}
		else
		{
			var numeros = cnpj.substring(0,12);
			var digitos = cnpj.substring(12);
			var soma = 0;
			var pos = 12 - 7;
			for (var i = 12; i >= 1; i--) 
			{
				soma += numeros.charAt(12 - i) * pos--;
				if (pos < 2)
				{
					pos = 9;
				}
			}
			var resultado = (soma % 11 < 2) ? 0 : (11 - (soma % 11));
			// segunda validação
			if (resultado != digitos.charAt(0))
			{
				return false;
			}
			else
			{
				numeros = cnpj.substring(0,13);
				soma = 0;
				pos = 13 - 7;
				for (i = 13; i >= 1; i--) 
				{
					soma += numeros.charAt(13 - i) * pos--;
					if (pos < 2)
					{
						pos = 9;
					}
				}
				resultado = (soma % 11 < 2) ? 0 : (11 - (soma % 11));
				// terceira validação
				if (resultado != digitos.charAt(1))
				{
					return false; 
				}
				else
				{
					return true;
				}
			}
		}
	}
	pesquisa_cnpj()
	{
		if(this.cnpj != "" && !this.utils.valida_campo(this.cnpj))
		{
			if(this.valida_cnpj(this.cnpj))
			{
				if(this.cnpj != this.cnpj_buscado)
				{
					var cnpj = this.cnpj;
					this.cnpj_buscado = cnpj;
					cnpj = cnpj.replace(".", "");
					cnpj = cnpj.replace(".", "");
					cnpj = cnpj.replace("/", "");
					cnpj = cnpj.replace("-", "");	
					// enviando solicitação de registro
					this.user.buscar_cnpj(cnpj).then((resultado) => 
					{
						var dados : any = resultado;
						this.razao_soc = dados.atividade_principal[0].text;
						this.nome_fantasia = dados.fantasia;
						this.estado = dados.uf;
						this.cidade = dados.municipio;
						this.endereco = dados.logradouro +" "+ dados.numero;
						this.nome = dados.nome;
						this.tel = dados.telefone;
						this.email = dados.email;
						this.data_const = this.utils.transforma_to_date_contrario(dados.abertura);
						document.getElementById("dados_receita").style.display = "block";						
					},(erro) => {});
				}
			}
		}
	}
}
