import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SendOrderPage } from '../send-order/send-order';
import { Interface_usuario } from '../../providers/classes/interface';
import { Utilidades } from '../../providers/classes/utilidades';
@IonicPage()
@Component({selector: 'page-cart',templateUrl: 'cart.html'})
export class CartPage 
{
	// variável que vai receber os pedidos
	private pedidos : any = [];
	// variável que vai receber o total de pedidos
	private total_pedidos : number = 0;
	constructor
	(
		private navCtrl: NavController,
		private navParams: NavParams,
		private utils: Utilidades,
		private interface_usuario: Interface_usuario
	) {}
	// remover pedido de um fornecedor específico
	remove(idfornecedor, event)
	{
		// não ativar o click do card
		event.stopPropagation();
		// criando função de confirmação a ser passada por parâmetro a função
		var function_confirm = (context) => 
		{
			context._remove(idfornecedor);
		}
		// criando alerta para confirmar remoção
		this.interface_usuario.alerta_com_contexto('Carrinho', 'Você deseja remover este item do carrinho?', this, 'Remover', function_confirm);
	}
	// removendo o pedido objeto
	_remove(idfornecedor)
	{
		// achando o índice do item escolhido
		var index = this.pedidos.indexOf(this.pedidos.find(pedido => pedido.id == idfornecedor));
		// removendo o indice da variável
		this.pedidos.splice(index, 1);
		// armazenando novo item no carrinho
		localStorage.setItem("carrinho", JSON.stringify(this.pedidos));
	}
	// calculando o valor total do carrinho
	calcula_total()
	{
		// estabelecendo o valor inicial como 0
		this.total_pedidos = 0;
		// para cada fornecedor
		this.pedidos.forEach(fornecedor => 
		{
			// para cada produto
			fornecedor.produtos.forEach(produto => 
			{
				// o preço total é adicionado o preço x a quantidade do produto
				this.total_pedidos += produto.preco_fim * produto.qtd;
			});
		});
	}
	seleciona_pedido(pedido)
	{
		// muda para a página de envio de pedido com o pedido como parâmetro
		this.navCtrl.push(SendOrderPage, { pedido: pedido });
	}
	// buscando o valor de cada pedido
	total_por_pedido(pedido)
	{
		// estabelecendo o valor total como zero para mínimo
		var total = 0;
		// para cada produto
		pedido.produtos.forEach(produto => 
		{
			// o total recebe o valor do produto x a quantidade 
			total += produto.preco_fim * produto.qtd;
		});
		// retornando o total transformado para preço
		return this.utils.transforma_to_preco(total);
	}
	// toda vez que a página for entrar
	ionViewWillEnter()
	{
		// se houver algum item pago
		if(this.navParams.get('pagamento'))
		{
			// remover este item da lista
			this._remove(this.navParams.get('pagamento'));
		}
	}
	// função utilizada para mostrar os pedidos e calcular o total
	lista_pedidos()
	{
		// os pedidos recebem a lista de pedidos atualizada
		this.pedidos = JSON.parse(localStorage.getItem("carrinho"));
		// calcula o total do valor por pedido
		this.calcula_total();
		return this.pedidos;
	}
}