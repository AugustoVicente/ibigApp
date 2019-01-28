import { Injectable } from '@angular/core';
import { Servidor } from './servidor';
import { Interface_usuario } from './interface';
@Injectable()
// classe que controla as ações do usuário
export class Usuario
{
    constructor
    (
        public interface_usuario: Interface_usuario,
        public servidor: Servidor
	) {}
	// função que realiza o login no sistema
    entrar(login, senha)
	{
		// criando array de dados a ser enviado como request ao webservice
		var dados = [];
		dados.push({id:"login",valor:login});
		dados.push({id:"senha",valor:senha});
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// criando load
			var load = context.interface_usuario.load_variavel("Carregando..");
			load.present();
			//se usuário for tecnico as credenciais ficam armazenadas na memória local do celular e redireciona para a página principal do aplicativo
			switch(resultado.resultado) 
			{	
				// se o resultado for "cod1" o usuário teve sucesso ao entrar
				case "cod1":
					// armazenando o login e senha
					localStorage.setItem("login", login);
					localStorage.setItem("senha", senha);
					// buscando informações do parceiro
					context.busca_info_parceiro(login).then(sucesso =>
					{
						// dispensando o load
						load.dismiss();
						// confirmando
						resolve(true);
					},error => 
					{
						reject(false);
					});
					break;
				// se o resultado for "cod0", as credenciais são inválidas
				case "cod0":
					// apresentando alerta de erro
					context.interface_usuario.alerta_padrao("Erro", "Login ou senha inválidos!", ["ok"]);
					// dispensando o load
					load.dismiss();
					reject(false);
					break;
				// se o resultado for "cod2", as credenciais não tem acesso ao atual aplicativo
				case "cod2":
					// apresentando alerta de erro
					context.interface_usuario.alerta_padrao("Erro", "Sua conta não tem acesso a este aplicativo!", ["ok"]);
					// dispensando o load
					load.dismiss();
					reject(false);
					break;
			}
		};
		// criando fução para lidar com resultado negativo
		var function_reject = (reject, erro, context) =>
		{
			// alertando que não há conexão com a internet
			context.interface_usuario.alerta_padrao("Sem conexão de internet","Erro: " + erro, ["ok"]);
			reject(false);
		};
		// criando promise da função
		let promise = new Promise(
		(resolve, reject) => 
		{
			// enviando request o servidor 
			this.servidor.envia_request(dados, "login", function_resolve, function_reject, this)
			.then(sucesso=>
			{
				resolve(true);
			}, erro =>
			{
				reject(false);
			});
		});
		return promise;
	}
	// função que busca informação do parceiro
    busca_info_parceiro(login)
	{
		// criando array de dados a ser enviado como request ao webservice
		var dados = [];
		dados.push({id:"email",valor:login});
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// armazenando resultado da request na local storage
			localStorage.setItem("dados_perfil", JSON.stringify(resultado));
			resolve(true);
		};
		// criando função para lidar com resultado negativo
		var function_reject = (reject, erro, context) =>
		{
			// alertando que não há conexão com a internet
			context.interface_usuario.alerta_padrao("Sem conexão de internet","Erro: " + erro, ["ok"]);
			reject(false);
		};
		// criando promise da função
		let promise = new Promise(
		(resolve, reject) => 
		{
			// enviando request o servidor
			this.servidor.envia_request(dados, "info_profile", function_resolve, function_reject, this)
			.then(sucesso=>
			{
				resolve(true);
			}, erro =>
			{
				reject(false);
			});
		});
		return promise;
	}
	// função que realiza o registro do novo usuário
    registrar(dados)
	{
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// criando load
			var load = context.interface_usuario.load_variavel("Carregando..");
			load.present();
			switch(resultado.resultado) 
			{
				// se o resultado for "cod3" o cadastro foi concluido
				case "cod3":
					// apresentando alerta de sucesso
					context.interface_usuario.alerta_padrao("Sucesso!","Cadastro realizado, entre no email para mais informações!", ["ok"]);
					// dispensando o load
					load.dismiss();
					resolve(true);
					break;
				// se o resultado for "cod4" ou "cod5" houve erro 
				case "cod4":
					// apresentando alerta de erro
					context.interface_usuario.alerta_padrao("Erro","O cadastro não pôde ser realizado! \nPor favor, tente novamente.", ["ok"]);
					// dispensando o load
					load.dismiss();
					reject(false);
					break;
				case "cod5":
					// apresentando alerta de erro
					context.interface_usuario.alerta_padrao("Erro",resultado.mensagem+"\n Por favor, tente novamente.", ["ok"]);
					// dispensando o load
					load.dismiss();
					reject(false);
					break;
			}
		};
		// criando função para lidar com resultado negativo
		var function_reject = (reject, erro, context) =>
		{
			// alertando que não há conexão com a internet
			context.interface_usuario.alerta_padrao("Sem conexão de internet","Erro: " + erro, ["ok"]);
			reject(false);
		};
		// criando promise da função
		let promise = new Promise(
		(resolve, reject) => 
		{ 
			// enviando request o servidor
			this.servidor.envia_request(dados, "registrar_pareceiro", function_resolve, function_reject, this)
			.then(sucesso=>
			{
				resolve(true);
			}, erro =>
			{
				reject(false);
			});
		});
		return promise;
	}
	// solicita ao servidor para realizar uma operação de recuperar a senha
	recuperar_senha(dados)
	{
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// criando load
			var load = context.interface_usuario.load_variavel("Carregando..");
			load.present();
			switch(resultado.resultado) 
			{
				// se o resultado for "cod7" a recuperação de senha foi bem sucedida
				case "cod7":
					// apresentando alerta de sucesso
					context.interface_usuario.alerta_padrao("Sucesso!", "A nova senha foi gerada, entre no email para saber os próximos passos!", ["ok"]);
					// dispensando o load
					load.dismiss();
					resolve(true);
					break;
				// se o resultado for "cod4" houve erro ao enviar o email
				case "cod4":
					// apresentando alerta de erro
					context.interface_usuario.alerta_padrao("Erro", "Não foi possível enviar o email, por favor tente novamente", ["ok"]);
					// dispensando o load
					load.dismiss();
					reject(false);
					break;
				// se o resultado for "cod5" ou "cod6" houve outro erro
				case "cod5" || "cod6":
					// apresentando alerta de sucesso
					context.interface_usuario.alerta_padrao("Erro", resultado.mensagem+"\n Por favor, tente novamente.", ["ok"]);
					// dispensando o load
					load.dismiss();
					reject(false);
					break;
			}
		};
		// criando função para lidar com resultado negativo
		var function_reject = (reject, erro, context) =>
		{
			// alertando que não há conexão com a internet
			context.interface_usuario.alerta_padrao("Sem conexão de internet","Erro: " + erro, ["ok"]);
			reject(false);
		};
		// criando promise da função
		let promise = new Promise(
		(resolve, reject) => 
		{ 
			// enviando request o servidor
			this.servidor.envia_request(dados, "recupera_senha", function_resolve, function_reject, this)
			.then(sucesso=>
			{
				resolve(true);
			}, erro =>
			{
				reject(false);
			});
		});
		return promise;
	}
	// função que edita os dados do perfil
    edita_perfil(dados)
	{
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// se o resultado for "cod12" os dados foram alterados 
			if(resultado.resultado === "cod12")
			{
				resolve(resultado);
			}
			// se o login estiver inválido informar ao usuário
			else if(resultado.resultado === "cod5")
			{
				// apresentando alerta de erro
				context.interface_usuario.alerta_padrao("Erro ao alterar",resultado.mensagem+"\n Por favor, tente novamente.", ["ok"]);
				reject(false);
			}
		};
		// criando função para lidar com resultado negativo
		var function_reject = (reject, erro, context) =>
		{
			// alertando que não há conexão com a internet
			context.interface_usuario.alerta_padrao("Sem conexão de internet","Erro: " + erro, ["ok"]);
			reject(false);
		};
		// criando promise da função
		let promise = new Promise(
		(resolve, reject) => 
		{ 
			// enviando request o servidor
			this.servidor.envia_request(dados, "editar_perfil", function_resolve, function_reject, this)
			.then(sucesso=>
			{
				resolve(sucesso);
			}, erro =>
			{
				reject(false);
			});
		});
		return promise;
	}
	// função que busca pedidosdo parceiro
	busca_pedidos_parceiro(id_parceiro)
	{
		// criando array de dados a ser enviado como request ao webservice
		var dados = [];
		dados.push({id:"id_parceiro",valor:id_parceiro});;
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// se o resultado for "cod15" a busca teve sucesso
			if(resultado[0] === "cod15")
			{
				// removendo o primeiro item da array (o resultado)
				resultado.splice(0, 1);
				resolve(resultado);
			}
			// se o resultado for "cod14" ou "cod5" houve erro
			else if(resultado[0] === "cod14" || resultado[0] === "cod5")
			{
				reject(false);
			}
		};
		// criando função para lidar com resultado negativo
		var function_reject = (reject, erro, context) =>
		{
			// alertando que não há conexão com a internet
			context.interface_usuario.alerta_padrao("Sem conexão de internet","Erro: " + erro, ["ok"]);
			reject(false);
		};
		// criando promise da função
		let promise = new Promise(
		(resolve, reject) => 
		{
			// enviando request o servidor
			this.servidor.envia_request(dados, "busca_pedidos_parceiro", function_resolve, function_reject, this)
			.then(sucesso=>
			{
				resolve(sucesso);
			}, erro =>
			{
				reject(false);
			});
		});
		return promise;
	}
	// função que faz o upload da imagem
	upload_imagem(imageURI, id_parceiro)
	{
		// criando array de dados a ser enviado como request ao webservice
		var dados = [];
		dados.push({id:"id_parceiro",valor:id_parceiro});
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// avisando ao usuário que houve sucesso
			context.interface_usuario.toast_padrao("Imagem alterada com sucesso");
			resolve(resultado);
		};
		// criando função para lidar com resultado negativo
		var function_reject = (reject, erro, context) =>
		{
			// alertando que não há conexão com a internet
			context.interface_usuario.alerta_padrao("Erro ao alterar imagem", erro, ["ok"]);
			reject(false);
		};
		// criando promise da função
		let promise = new Promise(
		(resolve, reject) => 
		{ 
			// enviando request o servidor
			this.servidor.upload(dados, "alterar_foto", function_resolve, function_reject, this, imageURI, id_parceiro)
			.then(sucesso=>
			{
				resolve(sucesso);
			}, erro =>
			{
				reject(false);
			});
		});
		return promise;
	}
	buscar_cnpj(cnpj)
	{
		// criando array de dados a ser enviado como request ao webservice
		var dados = [];
		dados.push({id:"cnpj",valor:cnpj});
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			resolve(resultado);
		};
		// criando fução para lidar com resultado negativo
		var function_reject = (reject, erro, context) =>
		{
			// alertando que não há conexão com a internet
			context.interface_usuario.alerta_padrao("Sem conexão de internet","Erro: " + erro, ["ok"]);
			reject(false);
		};
		// criando promise da função
		let promise = new Promise(
		(resolve, reject) => 
		{
			// criando load
			var load = this.interface_usuario.load_variavel("Carregando.. (Esse processo pode levar alguns minutos)");
			load.present();
			// enviando request o servidor 
			this.servidor.envia_request(dados, "busca_cnpj", function_resolve, function_reject, this)
			.then(sucesso=>
			{
				load.dismiss();
				resolve(sucesso);
			}, erro =>
			{
				load.dismiss();
				reject(false);
			});
		});
		return promise;
	}
}