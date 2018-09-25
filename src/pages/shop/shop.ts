import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AddToCartPage } from '../add-to-cart/add-to-cart';
import { CartPage } from '../cart/cart';
import { Servidor } from '../../providers/classes/servidor';
import { Utilidades } from '../../providers/classes/utilidades';
import { Mercado } from '../../providers/classes/mercado';
@IonicPage()
@Component({selector: 'page-shop', templateUrl: 'shop.html'})
export class ShopPage 
{
	// variável que recebe a lista de produtos
	private produtos : any;
	// variável que recebe o status do pregão
	private status : number;
	// variável que recebe os valores do filtro
	private filtro : string = "";
	constructor
	(
		private navCtrl: NavController,
		private modalCtrl: ModalController,
		private mercado: Mercado,
		private utils: Utilidades,
		private server: Servidor // utilizado pelo html
	) 
	{
		// buscando lista de produtos ao iniciar a tela
		this.refresh(null);
	}
	// função que retorna true ou false pra bloquear a entrada na página do carrinho de compras
	lock_carrinho()
	{
		// se o item carrinho no local storage for nulo ou tiver tamanho igual a zero
		if (JSON.parse(localStorage.getItem("carrinho")) === null || JSON.parse(localStorage.getItem("carrinho")).length == 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	// função que retorna a quantidade de itens no carrinho
	qtd_itens_carrinho()
	{
		// se o carrinho estiver desbloqueado
		if(this.lock_carrinho() == false)
		{
			// retorna a quantidade de itens
			return JSON.parse(localStorage.getItem("carrinho")).length;
		}
		else
		{
			return 0;
		}
	}
	// função que muda para a página de adicionar produto ao carrinho de compras passando o carrinho como parâmetro
	escolhe_produto(produto)
	{
		// muda de página enviando os parâmetros e o status do mercado para cálculo de preço
		this.navCtrl.push(AddToCartPage, { produto: produto, status: this.status });
	}
	// função que retorna a mensagem e a cor do chip que será utilizado no html de acordo com o status do mercado
	estado_mercado()
	{
		// declarando variável que receberá o retorno da função
		var dados : any = [];
		// se o pregão está aberto
		if(this.status == 1)
		{
			// adicioina mensagem e cor finais a variável de retorno
			dados.push({msg_pregao:"IBig Pregão aberto até as 18:00"});
			dados.push({cor_aberto:"_green"});
			return dados;
		}
		else
		{
			// adicioina mensagem e cor finais a variável de retorno
			dados.push({msg_pregao:"IBig Pregão fechado"});
			dados.push({cor_aberto:"danger_2"});
			return dados;
		}
	}
	// função que atualiza os produtos na loja
	refresh(refresher)
	{
		// realiza busca dos produtos ao carregar
		this.mercado.busca_todos_produtos().then(produtos => 
		{
			// recebe o novo status
			this.status = produtos[0].status;
			// removendo o primeiro item dos produtos de retorno
			produtos.splice(0, 1);
			// passando os produtos para a variável destino
			this.produtos = produtos;
			// se houver um objeto refresh
			if(refresher)
			{
				// dispensa o refresh após término
				refresher.complete();
			}
		},erro=>{});
	}
	// função que entra na página do carrinho
	enter_cart()
	{
		this.navCtrl.push(CartPage);
	}
	// função que retorna true ou false para caso o produto corresponda ao filtro da barra de search
	filtrar(produto)
	{
		// se alguma parte da descrição do produto tiver correspondência do filtro
		if (produto.marca.toLowerCase().includes(this.filtro.toLowerCase()) == true || 
			produto.nome.toLowerCase().includes(this.filtro.toLowerCase()) == true || 
			produto.descricao.toLowerCase().includes(this.filtro.toLowerCase()) == true ||
			produto.preco.toLowerCase().includes(this.filtro.toLowerCase()) == true)
		{
			return true;
		}
		// caso não	
		else
		{
			return false;
		}
	}
	// função que retorna o preço do produto formatado segundo o formato de preço do Brasil
	preco_produto(preco, desconto)
	{
		// se o status do pregão for 1, o preço final recebe a primeira operação (descontando 1.5 de comissão para nós)
		// caso contrário recebe a segunda operação (descontando 2.5 de comissão para nós)
		var preco_final = (this.status == 1) ? (preco*(1-((desconto-1.5)/100))) : (preco*(1-((desconto-2.5)/100)));
		// retornando o valor formatado no molde brasileiro de preço
		return this.utils.transforma_to_preco(preco_final);
	}
}