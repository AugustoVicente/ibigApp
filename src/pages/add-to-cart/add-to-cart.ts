import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Interface_usuario } from '../../providers/classes/interface';
import { Servidor } from '../../providers/classes/servidor';
import { Utilidades } from '../../providers/classes/utilidades';
@IonicPage()
@Component({selector: 'page-add-to-cart', templateUrl: 'add-to-cart.html'})
export class AddToCartPage 
{
	// quantidade mínima é 1
	private qtd : any = 1;
	// variável que recebe os dados do produto
	private produto : any;
	// variável que recebe a porcentagem de desconto
	private porcentagem : number;
	// variável que recebe o status do mercado neste momento
	private status : number;
	// variavel que armazena o preço padrão fixo
	private preco_fixo : number = 0;
	// variável que recebe o preço final do pedido deste produto
	private preco_fim : number;
	constructor
	(
		private navCtrl: NavController,
		private utils: Utilidades,
		private interface_usuario: Interface_usuario,
		private navParams: NavParams, // utilizado no contexto das funções criadas
		private server: Servidor // utilizado no contexto das funções criadas
	) 
	{
		// recebendo parâmetros de navegação
		this.produto = navParams.get('produto');
		this.status = navParams.get('status');
		// estabelecendo um preço fixo
		this.preco_fixo = this.produto.preco;
		// se o pregão estiver ocorrendo
		if(this.status == 1)
		{
			// desconta porcentagem do ibig do desconto oferecido
			this.preco_fim = this.produto.preco*(1-((this.produto.desconto-1.5)/100));
		}
		else if(this.status == 0)
		{
			// desconta porcentagem do ibig do desconto oferecido
			this.preco_fim = this.produto.preco*(1-((this.produto.desconto-2.5)/100));
		}
	}
	// fecha página
	close()
	{ 
		this.navCtrl.pop();
	}
	// aumenta 1 quantidade do produto
	adiciona()
	{
		// adiciona 1 na quantidade
		this.qtd += 1;
		// estabeledce o preço como o preço fixo * quantidade
		this.produto.preco = this.preco_fixo * this.qtd; 
	}
	// remove 1 quantidade do produto
	remove()
	{
		// limita o mínimo a um item da compra
		if(this.qtd != 1)
		{
			// remove 1 na quantidade
			this.qtd -= 1;
			// estabeledce o preço como o preço fixo * quantidade
			this.produto.preco = this.preco_fixo * this.qtd; 
		}
	}
	// envia pedido
	add_pedido()
	{
		// criando função de confirmação a ser passada por parâmetro a função
		var function_confirm = (context) => 
		{
			// se estiver vazio o carrinho
			if(localStorage.getItem("carrinho") === null || localStorage.getItem("carrinho") == "[]")
			{
				var pedido = [];
				// incrementa um pedido com seus produtos
				pedido.push(
				{	
					id:context.produto.idFornecedor, marca:context.produto.marca, imagem: context.produto.img_fornecedor, produtos: 
					[
						{
							id:context.produto.idproduto, desconto: context.preco_fixo-context.preco_fim, qtd:context.qtd, 
							preco_fim:context.preco_fim, preco:context.preco_fixo, img:context.server.get_product_image_url(context.produto.link_imagem), 
							nome:context.produto.nome
						}
					]
				});
				// armazena no carrinho e volta
				localStorage.setItem("carrinho", JSON.stringify(pedido));
				context.interface_usuario.toast_padrao('Pedido adicionado ao carrinho!');
				context.navCtrl.pop();
			}
			// se houver algo no carrinho
			else
			{
				var existente : boolean = false;
				// recebe o carrinho
				var carrinho = JSON.parse(localStorage.getItem("carrinho"));
				carrinho.forEach(pedido => 
				{
					// verificando se é o mesmo fornecedor
					if(pedido.id == context.produto.idFornecedor)
					{
						// recebe true para saber se foi de um fornecedor já adicionado ao carrinho
						existente = true;
						// declarando varável para saber se o produto já foi adicionado ao carrinho
						var repetido = false;
						pedido.produtos.forEach(produto => 
						{
							// percorrendo cada produto para ver se já existe tal produto no carrinho
							if(produto.id == context.produto.idproduto)
							{
								// declarando que já existe o produto no carrinho
								repetido = true;
								// aumentando a quantidade do produto selecionado
								produto.qtd += context.qtd;
								// declarano o preço como o atual
								produto.preco = context.preco_fixo;
								// declarando o preço total
								produto.preco_fim = context.preco_fim;
								// declarando o desconto como o preço normal menos o preço final
								produto.desconto = produto.preco-produto.preco_fim;
							}
						});
						// se o produto não foi adicionado ao carrinho
						if(repetido == false)
						{
							// adicionando novo produto ao pedido do fornecedor atual
							pedido.produtos.push(
							{
								id:context.produto.idproduto, desconto: (context.produto.preco-(context.preco_fim*context.qtd)), qtd:context.qtd, 
								preco_fim:context.preco_fim, preco:context.preco_fixo, img:context.server.get_product_image_url(context.produto.link_imagem), 
								nome:context.produto.nome
							});
						}
					}
				});
				// se há pedidos do atual fornecedor
				if(existente)
				{
					// armazena os pedidos com os novos dados
					localStorage.setItem("carrinho", JSON.stringify(carrinho));
				}
				else
				{
					// se não, cria novo fornecedor e adiciona os produtos
					var pedidos = [];
					pedidos.push(
					{	
						id:context.produto.idFornecedor, marca:context.produto.marca, imagem: context.produto.img_fornecedor, produtos: 
						[
							{
								id:context.produto.idproduto, desconto: (context.produto.preco-(context.preco_fim*context.qtd)), qtd:context.qtd, 
								preco_fim:context.preco_fim, preco:context.preco_fixo, img:context.server.get_product_image_url(context.produto.link_imagem), 
								nome:context.produto.nome
							}
						]
					});
					// armazena estes novos pedido
					localStorage.setItem("carrinho", JSON.stringify(pedidos));
				}
				// confirmando salvamento
				context.interface_usuario.toast_padrao('Pedido salvo!');
				context.navCtrl.pop();
			}
		}
		// criando alerta para confirmação de ação
		this.interface_usuario.alerta_com_contexto('Pedido', 'Você deseja salvar este pedido ao carrinho?', this, 'Adicionar', function_confirm);
	}
	// big oportunidade
	preco_produto(preco, desconto)
	{
		// variável que recebe o preço final
		var preco_fim;
		// se o pregão estiver ocorrendo
		if(this.status == 1)
		{
			// a porcentagem do desconto é o desconto - 1.5% redirecionado para o ibig
			this.porcentagem = desconto-1.5;
			// calculo do preço final
			preco_fim = preco*(1-((desconto-1.5)/100));
			// retorna o preço final arredondado e com o R$ na frente
			return this.utils.transforma_to_preco(preco_fim);
		}
		else
		{
			// a porcentagem do desconto é o desconto - 2.5% redirecionado para o ibig
			this.porcentagem = desconto-2.5;
			// calculo do preço final
			preco_fim = preco*(1-((desconto-2.5)/100));
			// retorna o preço final arredondado e com o R$ na frente
			return this.utils.transforma_to_preco(preco_fim);
		}
	}
	ionViewCanLeave()
	{
		// estabelece o preço fixo como padrão ao voltar a página
		this.produto.preco = this.preco_fixo;
	}
}
