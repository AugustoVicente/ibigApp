import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Interface_usuario } from '../../providers/classes/interface';
import { Utilidades } from '../../providers/classes/utilidades';
import { Pedido } from '../../providers/classes/pedido';
import { Mercado } from '../../providers/classes/mercado';
@IonicPage()
@Component({selector: 'page-send-order', templateUrl: 'send-order.html'})
export class SendOrderPage 
{
	// variável que irá receber as formas de pagamento do fornecedor
	private formas_pagamento : any = null;
	// variável que irá receber o pedido passado como parâmetro
	private pedido : any;
	// variável que vai receber o pagamento escolhido
	private pagamento : number = 0;
	constructor
	(
		private navCtrl: NavController, // parâmetro utilizado em função com contexto
		private navParams: NavParams, // parâmetro utilizado em função com contexto
		private interface_usuario: Interface_usuario,
		private utils: Utilidades,
		private pedido_class: Pedido,
		private mercado: Mercado
	) 
	{
		// recebendo o pedido passado como parâmetro de navegção
		this.pedido = navParams.get('pedido');
		// buscando as formas de pagamento de acordo com o fornecedor específico 
		this.mercado.busca_formas_pagamento(this.pedido.id).then(formas_pagamento => 
		{
			// recebendo as formas de pagamento
			this.formas_pagamento = formas_pagamento;
		},erro=>{});
	}
	// enviar o pedido do cliente
	envia_pedido()
	{
		// criando função de confirmação a ser passada por parâmetro a função
		var function_confirm = (context) => 
		{
			// variável que recebe os valores a serem passados como parãmetro para o webservice
			var dados = [];
			// adicionando dados de parãmetro
			dados.push({id:"login",valor:localStorage.getItem("login")});
			dados.push({id:"produtos",valor:JSON.stringify(context.pedido.produtos)});
			dados.push({id:"valor",valor:context.preco_total_number()});
			dados.push({id:"desconto",valor:context.economia_total_number()});
			dados.push({id:"tipo_pagamento",valor:context.pagamento});
			dados.push({id:"status",valor:context.mercado.status_mercado});
			dados.push({id:"idfornecedor",valor:context.pedido.id});
			// enviando o pedido
			context.pedido_class.envia(dados).then(envio=>
			{
				// se o envio der certo adiciona o id do fornecedor á variável de pagamento para exclusão do carrinho ao final
				context.navCtrl.getPrevious().data.pagamento = context.pedido.id;
				// voltando a página
				context.navCtrl.pop();
			},erro=>{});
		}
		// criando alerta para confirmação de envio
		this.interface_usuario.alerta_com_contexto('Pedido', 'Você deseja enviar o pedido para ser analisado?', this, 'Enviar', function_confirm);
	}
	// função que retorna o preço total formatado como preço (frormato brasileiro)
	preco_total()
	{
		// retornando o preço formatado
		return this.utils.transforma_to_preco(this.preco_total_number());
	}
	// função que retorna o preço total como número
	preco_total_number()
	{
		// estabelecendo o total como zero para o caso de não haver nenhum valor
		var total = 0;
		// para cada produto 
		this.pedido.produtos.forEach(produto => 
		{
			// adiciona o valor multiplicado pela quantidade ao valor total
			total += produto.preco_fim * produto.qtd;
		});
		// retorna o valor final
		return total;
	}
	// função que retorna a economia total formatada como preço (frormato brasileiro)
	economia_total()
	{
		// retornando a economia formatada
		return this.utils.transforma_to_preco(this.economia_total_number());
	}
	// função que retorna a economia total como número
	economia_total_number()
	{
		// estabelecendo o total como zero para o caso de não haver nenhum valor
		var total = 0;
		// para cada produto 
		this.pedido.produtos.forEach(produto => 
		{
			// adiciona o valor multiplicado pela quantidade ao valor total
			total += produto.desconto * produto.qtd;
		});
		// retorna o valor final
		return total;
	}
	// função que remove um produto do pedido pelo id dele
	remove(idproduto)
	{
		// criando função de confirmação a ser passada por parâmetro a função
		var function_confirm = (context) => 
		{
			// declarando variável que recebe os pedidos do carrinho
			var pedidos : any = JSON.parse(localStorage.getItem("carrinho"));
			// variável que recebe o index do produto desejado
			var index_produto = context.pedido.produtos.indexOf(context.pedido.produtos.find(produto => produto.id == idproduto));
			// removendo produto do index encontrado
			context.pedido.produtos.splice(index_produto, 1);
			// se não houver mais produtos
			if(context.pedido.produtos.length == 0)
			{
				// variável que recebe o index do fornecedor desejado na array dos pedidos
				var index_fornecedor = pedidos.indexOf(pedidos.find(pedido => pedido.id == context.pedido.id));
				// remove pedido do fornecedor do carrinho de compras
				pedidos.splice(index_fornecedor, 1);
			}
			else
			{
				// substitui o pedido anterior pelo novo atualizado
				pedidos.splice(index_fornecedor, 1, context.pedido);
			}
			// armazenando o carrinho atualizado
			localStorage.setItem("carrinho", JSON.stringify(pedidos));
		}
		// criando alerta para confirmar a exclusão do produto deste pedido
		this.interface_usuario.alerta_com_contexto('Carrinho', 'Você deseja remover este produto do pedido?', this, 'Remover', function_confirm);
	}
	// função que retorna true ou false para desabilitar o botão de envio caso não haja produtos no carrinho
	qtd()
	{
		// se a quantidade de produtos for igual a zero
		if(this.pedido.produtos.length == 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	// carregando formas de pagamento 
	atualiza_forma_pagamento()
	{
		// variável que recebe as formas de pagamento formatadas de acordo com as condições cadastradas
		var formas_pagamento_formatadas = [];
		// adicionando a forma "á vista". OBS: esta é padrão e não foi adiconada no banco
		formas_pagamento_formatadas.push({value: 0, nome: "Á vista", valor_inicial: 0});
		// se já foi buscado as formas de pagamento, faz a filtragem de acordo com o preço
		if(this.formas_pagamento != null)
		{
			// se a forma de pagamento em duas vezes existe
			if(this.formas_pagamento.dois_x != 0)
			{
				// se o valor inicial for menor ou igual a quantidade total do pedido, esta forma de pagamento é ativada
				if(this.formas_pagamento.valorInicial2 <= this.preco_total_number())
				{
					// adicionando a forma de pagamento a variável de retorno
					formas_pagamento_formatadas.push({value: 1, nome: "2x ("+this.formas_pagamento.dois_x+" dias)", valor_inicial: this.formas_pagamento.valorInicial2});
				}
			}
			// se a forma de pagamento em três vezes existe
			if(this.formas_pagamento.tres_x != 0)
			{
				// se o valor inicial for menor ou igual a quantidade total do pedido, esta forma de pagamento é ativada
				if(this.formas_pagamento.valorInicial3 <= this.preco_total_number())
				{
					// adicionando a forma de pagamento a variável de retorno
					formas_pagamento_formatadas.push({value: 2, nome: "3x ("+this.formas_pagamento.tres_x+" dias)", valor_inicial: this.formas_pagamento.valorInicial3});
				}
			}
			// se a forma de pagamento em quatro vezes existe
			if(this.formas_pagamento.quatro_x != 0)
			{
				// se o valor inicial for menor ou igual a quantidade total do pedido, esta forma de pagamento é ativada
				if(this.formas_pagamento.valorInicial4 <= this.preco_total_number())
				{
					// adicionando a forma de pagamento a variável de retorno
					formas_pagamento_formatadas.push({value: 3, nome: "4x ("+this.formas_pagamento.quatro_x+" dias)", valor_inicial: this.formas_pagamento.valorInicial4});
				}
			}
			// retorna a as formas de pagamento formatadas e filtradas
			return formas_pagamento_formatadas;
		}
		else
		{
			// retorna somente a forma de pagamento padrão
			return formas_pagamento_formatadas;
		}
	}
}