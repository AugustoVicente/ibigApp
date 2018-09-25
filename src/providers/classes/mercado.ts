import { Injectable } from '@angular/core';
import { Servidor } from './servidor';
import { Interface_usuario } from './interface';
import { Usuario } from './usuario';
import { Pedido } from './pedido';
@Injectable()
export class Mercado
{
	// variável que controla se o mercado está aberto ou não
    public status : number;
    constructor
    (
        public interface_usuario: Interface_usuario,
        public user: Usuario,
        public pedidos_class: Pedido,
        public servidor: Servidor
	) {}
	// função que busca todos os produtos
    busca_todos_produtos()
	{
		// criando array de dados a ser enviado como request ao webservice
		var dados = [];
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// se o resultado for "cod10" houve sucesso
			if(resultado[0] === "cod10")
			{
				// removendo primeiro item do resultado
				resultado.splice(0, 1);
				// atualizando o status do mercado
				context.status = resultado[0].status;
				// atualizando os pedidos
				context.user.busca_pedidos_parceiro(JSON.parse(localStorage.getItem("dados_perfil"))[0].idParceiro).then(pedidos => 
				{
					// atualizando o historico dos pedidos
					context.pedidos_class.historico = pedidos;
				},erro => {});
				resolve(resultado);
			}
			// se o resultado for "cod9" houve erro
			else if(resultado[0] === "cod9")
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
		(resolve: (value?: any[]) => void, reject) => 
		{
			// enviando request o servidor 
			this.servidor.envia_request(dados, "busca_todos_produtos", function_resolve, function_reject, this)
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
	// função que busca as formas de pagamento
	busca_formas_pagamento(id_fornecedor)
	{
		// criando array de dados a ser enviado como request ao webservice
		var dados = [];
		dados.push({id:"id_fornecedor",valor:id_fornecedor});
		// criando função para lidar com resultado positivo
		var function_resolve = (resolve, reject, resultado, context) =>
		{
			// se o resultado for "cod16" houve sucesso
			if(resultado[0] === "cod16")
			{
				// removendo primeiro item do resultado
				resultado.splice(0, 1);
				// atualizando a variável resultado
				resultado = resultado[0];
				resolve(resultado);
			}
			// se o resultado for "cod17" ou "cod5" houve erro
			else if(resultado[0] === "cod17" || resultado[0] === "cod5")
			{
				// apresentando alerta de erro
				context.interface_usuario.alerta_padrao("Erro","Não foi possível carregar as formas de pagamento!", ["ok"]);
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
		(resolve: (value?: any) => void, reject) => 
		{
			// enviando request ao servidor
			this.servidor.envia_request(dados, "busca_formas_pagamento", function_resolve, function_reject, this)
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