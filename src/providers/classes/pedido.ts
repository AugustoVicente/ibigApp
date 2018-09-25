import { Injectable } from '@angular/core';
import { Servidor } from './servidor';
import { Interface_usuario } from './interface';
import { Usuario } from './usuario';
@Injectable()
export class Pedido
{
	// variável que armazena os pedidos no histórico
    public historico : any;
    constructor
    (
		public interface_usuario: Interface_usuario,
		public user: Usuario,
        public servidor: Servidor
	) {}
	// função que envia o pedido
    envia(dados)
	{
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// se o resultado for "cod11" houve sucesso
			if(resultado.resultado === "cod11")
			{
				// alertando ao usuário que houve sucesso
				context.interface_usuario.alerta_padrao("Sucesso!","Pedido Enviado", ["ok"]);
				// atualizando o histórico com o novo pedido gerado
				context.user.busca_pedidos_parceiro(JSON.parse(localStorage.getItem("dados_perfil"))[0].idParceiro).then(pedidos => 
				{
					// o histórico recebe os dados atualizados
					context.historico = pedidos;	
				},erro => {});
				resolve(resultado);
			}
			// se o resultado for "cod5" houve erro
			else if(resultado.resultado === "cod5")
			{
				// alertando o usuário que houve erro
				context.interface_usuario.alerta_padrao("Erro!",resultado.mensagem+"\n Por favor, tente novamente.", ["ok"]);
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
			this.servidor.envia_request(dados, "enviar_pedido", function_resolve, function_reject, this)
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
	// função que recusa a nova proposta do fornecedor 
    recusar(dados)
	{
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// se o resultado for "cod21" ou "cod5" houve erro
			if(resultado[0] === "cod21" || resultado[0] === "cod5")
			{
				// alerta o usuário que houve erro
				context.interface_usuario.alerta_padrao("Erro","Não foi possível alterar o pedido!", ["ok"]);
				reject(false);
			}
			// caso contrário houve sucesso
			else
			{
				resolve(resultado);
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
			this.servidor.envia_request(dados, "recusar_pedido", function_resolve, function_reject, this)
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
	// função que aceita a nova proposta do fornecedor
	aceitar(dados)
	{
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// se o resultado for "cod22" ou "cod5" houve erro
			if(resultado[0] === "cod22" || resultado[0] === "cod5")
			{
				// alerta o usuário que houve erro
				context.interface_usuario.alerta_padrao("Erro", "Não foi possível alterar o pedido!", ["ok"]);
				reject(false);
			}
			// caso contrário houve sucesso
			else
			{
				resolve(resultado);
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
			this.servidor.envia_request(dados, "aceitar_pedido", function_resolve, function_reject, this)
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
	// função que busca as informações do pedido
    informacoes(dados)
	{
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// se o resultado for "cod19" ou "cod5" houve erro
			if(resultado[0] === "cod19" || resultado[0] === "cod5")
			{
				// alerta o usuário que houve erro
				context.interface_usuario.alerta_padrao("Erro","Não foi possível carregar as informações do pedido!", ["ok"]);
				reject(false);
			}
			// caso contrário houve sucesso
			else
			{
				resolve(resultado);
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
		(resolve: (value?: any) => void, reject) => 
		{ 
			// enviando request o servidor
			this.servidor.envia_request(dados, "info_compra", function_resolve, function_reject, this)
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
	// função que busca as informações de download do pedido
    info_download(dados)
	{
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// se o resultado for "cod20" ou "cod5" houve erro
			if(resultado[0] === "cod20" || resultado[0] === "cod5")
			{
				// alerta o usuário que houve erro
				context.interface_usuario.alerta_padrao("Erro","Não foi possível carregar as informações do boleto!", ["ok"]);
				reject(false);
			}
			// caso contrário houve sucesso
			else
			{
				resolve(resultado);
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
		(resolve : (value?: any[]) => void, reject) => 
		{
			// enviando request o servidor
			this.servidor.envia_request(dados, "info_download", function_resolve, function_reject, this)
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
}