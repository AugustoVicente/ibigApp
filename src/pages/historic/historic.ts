import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Interface_usuario } from '../../providers/classes/interface';
import { Utilidades } from '../../providers/classes/utilidades';
import { Pedido } from '../../providers/classes/pedido';
import { Usuario } from '../../providers/classes/usuario';
import { FileDealer } from '../../providers/classes/file';
@IonicPage()
@Component({selector: 'page-historic', templateUrl: 'historic.html'})
export class HistoricPage 
{
	// variável que recebe os pedidos realizados
	private pedidos : any;
	// variável que controla o drop down do item de pedidos recebidos
	private mostra_recebidos : boolean = false;
	constructor
	(
		private user: Usuario,
		private file_dealer: FileDealer,
		private utils : Utilidades,
		private pedidos_class: Pedido,
		private interface_usuario: Interface_usuario
	) {}
	// toda vez q a tela for carregada
	ionViewWillEnter()
	{
		// a variável pedidos recebe o histórico de pedidos
		this.pedidos = this.pedidos_class.historico;
	}
	// função que atualiza os pedidos
	refresh(refresher)
	{
		// buscando os pedidos do respectivo parceiro
		this.user.busca_pedidos_parceiro(JSON.parse(localStorage.getItem("dados_perfil"))[0].idParceiro).then(pedidos => 
		{
			// recebendo os pedidos atualizados
			this.pedidos = pedidos;
			// se for uma função chamada pelo refresher
			if(refresher != null)
			{
				// dispensa o refresher
				refresher.complete();
			}
		},erro=>{});
	}
	// função que busca informação do pedido
	information(pedido, estado)
	{
		// variável que é enviada com parâmetros do webservice
		var dados = [];
		// adicionando parâmetros
		dados.push({id:"id_compra",valor:pedido.idCompra});
		// criando um loading personalizado para aparecer na tela
		var loading = this.interface_usuario.load_variavel("Carregando dados do pedido");
		// mostrando o loading criado
		loading.present();
		// buscando as informações de compra
		this.pedidos_class.informacoes(dados).then(itens_pedido => 
		{
			// dispensando o loading
			loading.dismiss();
			// mostrando o alerta que apresenta as informações
			this.apresenta_alerta_info(pedido, itens_pedido, estado);
		},erro=>{});
	}
	// função que busca informação do pedido recusado
	information_recusa(pedido)
	{
		// variável que é enviada com parâmetros do webservice
		var dados = [];
		// adicionando parâmetros
		dados.push({id:"id_compra",valor:pedido.idCompra});
		// criando um loading personalizado para aparecer na tela
		var loading = this.interface_usuario.load_variavel("Carregando dados do pedido");
		// mostrando o loading criado
		loading.present();
		// buscando as informações de compra
		this.pedidos_class.informacoes(dados).then(itens_pedido => 
		{
			// dispensando o loading
			loading.dismiss();
			// mostrando o alerta que apresenta as informações do pedido recusado
			this.apresenta_alerta_info_recusa(pedido, itens_pedido);
		},erro=>{});
	}
	// função que busca informação do download
	info_download(id_compra)
	{
		// variável que é enviada com parâmetros do webservice
		var dados = [];
		// adicionando parâmetros
		dados.push({id:"id_compra",valor:id_compra});
		// criando um loading personalizado para aparecer na tela
		var loading = this.interface_usuario.load_variavel("Carregando dados do pedido");
		// mostrando o loading criado
		loading.present();
		// buscando as informações do download do pedido
		this.pedidos_class.info_download(dados).then(boletos => 
		{
			// dispensando o loading
			loading.dismiss();
			// variável que vai receber os radio buttons dos boletos 
			var inputs = [];
			// para cada boleto
			boletos.forEach((boleto, i) => 
			{
				// adiciona um novo radio button
				inputs.push({type:'radio',label:'Boleto '+(i+1),value:boleto.url});
			});
			// criando função para lidar com o resultado da confirmação do alerta
			var function_confirm = (context, valor, id_compra) => 
			{
				// se tiver sido selecionado alguma opção
				if(valor != null)
				{
					// criando função para lidar com o resultado da confirmação do download
					var function_confirm = (context, id_compra, loading) => 
					{
						// criando função para lidar com o resultado da confirmação de abrir arquivo
						var function_confirm = (loading) => 
						{
							// dispensando loading
							loading.dismiss();
						}
						// criando função para lidar com o resultado da rejeição de abrir arquivo
						var function_reject = (context, loading) => 
						{
							// dispensando loading
							loading.dismiss();
							// se algo der errado mostra ao usuário
							context.interface_usuario.alerta_padrao("Erro",'Erro ao abrir o arquivo! Tente Novamente', ['Ok']);
						}
						// mostrando confirmação de download
						context.interface_usuario.toast_padrao('O arquivo foi baixado com sucesso!');
						// abrindo arquivo pdf
						context.file_dealer.open(function_confirm, function_reject, id_compra, loading, context);
					}
					// criando função para lidar com o resultado da rejeição do download
					var function_reject = (context, loading, error) => 
					{
						// dispensando loading
						loading.dismiss();
						// se algo der errado mostra ao usuário
						context.interface_usuario.alerta_padrao("Erro",'Houve um erro o fazer o download do arquivo: '+error, ['Ok']);
					}
					// o valor é a url do boleeto carregada do banco
					const url = valor;
					// criando loading
					var loading2 = context.interface_usuario.load_variavel("Baixando boleto");
					// apresentando loading
					loading2.present();
					// fazendo o download do boleto com o respectivo boleto selecionado
					context.file_dealer.download(function_confirm, function_reject, url, id_compra, loading2, context);
				}
				// se não houver selecionado nenhuma opção
				else
				{
					// notifica o usuário
					context.interface_usuario.toast_padrao("Selecione algum boleto!");
					// evita o fechamento do alert
					return false;
				}
			}
			// criando alert para escolher o boleto a ser baixado
			this.interface_usuario.alerta_subtitulo_contexto_input('Baixar Boletos', 'Selecione o boleto que deseja baixar.', inputs, null, this,
			'Baixar', function_confirm, id_compra);
		},erro=>{});
	}
	// mudando o status para mostar os pedidos recebidos
	set_recebidos()
	{
		// mudando
		this.mostra_recebidos = !this.mostra_recebidos;
	}
	// trocando o icone para seta para baixo ou para cima dependendo se está para mostrar ou não
	muda_icone_recebidos()
	{
		// se não estiver mostrando
		if(!this.mostra_recebidos)
		{
			// retorn seta pra baixo
			return "ios-arrow-dropdown";
		}
		else
		{
			// retorna seta pra cima
			return "ios-arrow-dropup";
		}
	}
	// função que retorna a quantidade de pedidos recebidos
	qtd_recebidos()
	{
		// declarando variável que recebe a quantidade e pedidos recebidos
		var qtd_recebidos : number = 0;
		// se existir algo nos pedidos
		if(this.pedidos)
		{
			// pra cada pedido
			this.pedidos.forEach(pedido => 
			{
				// vendo se há algum recebido comparando o status e o tipo de pagamento
				if((pedido.status == 5 && pedido.tipo_pagamento == 0) || (pedido.status == 6 && pedido.tipo_pagamento == 1) 
				|| (pedido.status == 7 && pedido.tipo_pagamento == 2) || (pedido.status == 8 && pedido.tipo_pagamento == 3))
				{
					// incrementando 1 na quantidade de recebidos
					qtd_recebidos += 1;
				}
			});
			// se a quantidade de recebidos continuar 0
			if(qtd_recebidos == 0)
			{
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			return false;
		}
	}
	// função que mostra o alerta das informações do pedido
	apresenta_alerta_info(pedido, dados, estado)
	{
		// declarando variáveis que vão compor o corpo do alerta
		var pagamento = "", altstatus = "", message = "";
		// filtrando os tipos de pagamento
		switch(pedido.tipo_pagamento) 
		{
			case 0:
				pagamento = "Á vista";
				break;
			case 1:
				pagamento = "2x ("+pedido.dois_x+" dias)";
				break;
			case 2:
				pagamento = "3x ("+pedido.tres_x+" dias)";
				break;
			case 3:
				pagamento = "4x ("+pedido.quatro_x+" dias)";
				break;
		}
		// filtrando o status do pedido
		switch(estado) 
		{
			case 0:
				altstatus += "<p>Confirmação do pedido: "+this.utils.transforma_to_date(pedido.data)+"</p>"; // data do próprio pedido
				break;
			case 2:	
				altstatus += "<p>Aprovação do pedido: "+this.utils.transforma_to_date(pedido.data_att)+"</p>";
				break;
			case 3:
				altstatus += "<p>Pagamento do pedido: "+this.utils.transforma_to_date(pedido.data_att)+"</p>";
				break;
			case 4:
				altstatus += "<p>Envio do pedido: "+this.utils.transforma_to_date(pedido.data_att)+"</p>";
				break;
			case 5:
				altstatus += "<p>Recebimento do pedido: "+this.utils.transforma_to_date(pedido.data_att)+"</p>";
				break;
		}
		// construindo a mensagem do alerta
		message += '<p>Pedido efetuado dia '+this.utils.transforma_to_date(pedido.data);
		message += ', com o valor total de '+this.utils.transforma_to_preco(pedido.valor);
		message += ', para o fornecedor '+pedido.marca+'.<p/><ul>'; 
		message += altstatus;
		message += '<li>Forma de pagamento: '+pagamento+".</li>";
		message += '<li>Desconto: '+this.utils.transforma_to_preco(pedido.pctg*10)+".</li>";
		message += '<li>Produtos: <ul>';
		// adicionando os dados de cada produto
		dados.forEach(produto => 
		{
			message += '<li>'+produto.nome+' ('+produto.qtd+' quantidade(s)): '+this.utils.transforma_to_preco(produto.valor)+'.</li>';
		});
		message += '</ul></li>';
		// se houver observações
		if(pedido.obs != null)
		{
			message += '<li>Observações: '+pedido.obs+"</li></ul>";
		}
		// criando alerta personalizado
		this.interface_usuario.alerta_padrao('Informações Pedido', message, ["OK"]);
	}
	// função que mostra o alerta das informações do pedido recusado
	apresenta_alerta_info_recusa(pedido, dados)
	{
		// construindo a mensagem do alerta
		var message = '<p>O pedido efetuado dia '+this.utils.transforma_to_date(pedido.data);
		message += ', com o valor total de '+this.utils.transforma_to_preco(pedido.valor);
		message += ', para o fornecedor '+pedido.marca+' foi recusado!<p/>'; 
		message += '<p>Observações do fornecedor: '+pedido.obs+"</p><ul>";
		message += '<li>Desconto: '+this.utils.transforma_to_preco(pedido.pctg*10)+".</li>";
		message += '<li>Produtos: <ul>';
		// adicionando os dados de cada produto
		dados.forEach(produto => 
		{
			message += '<li>'+produto.nome+' ('+produto.qtd+' quantidade(s)): '+this.utils.transforma_to_preco(produto.valor)+'.</li>';
		});
		message += '</ul></li></ul>';
		// criando função de confirmação
		var function_confirm = (context) =>
		{
			// criando variável que recebe os parâmetros para enviar ao webservice
			var dados = [];
			// adicionando parâmetro
			dados.push({id:"id_compra",valor:pedido.idCompra});
			// aceitando pedido
			context.pedidos_class.aceitar(dados).then(resultado => 
			{
				// confirmando ação
				context.interface_usuario.alerta_padrao("Feito!","Pedido aceito!", ['Ok']);
				// atualizando a página
				context.refresh(null);
			},erro=>{});
		};
		// criando função de rejeição
		var function_reject = (context) =>
		{
			// criando variável que recebe os parâmetros para enviar ao webservice
			var dados = [];
			// adicionando parâmetro
			dados.push({id:"id_compra",valor:pedido.idCompra});
			// recusando pedido
			context.pedidos_class.recusar(dados).then(itens_pedido => 
			{
				// confirmando ação
				context.interface_usuario.alerta_padrao("Feito!","Pedido negado!", ['Ok']);
				// atualizando a página
				context.refresh(null);
			},erro=>{});
		};
		// criando alerta personalizado
		this.interface_usuario.alerta_duplo_com_contexto('Informações do Pedido', message, this, "Aceitar", function_confirm, 'Recusar', function_reject);
	}
}