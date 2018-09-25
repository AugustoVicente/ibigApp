import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FileDealer } from './file';

@Injectable()
export class Servidor
{
	// variável que recebe o link do servidor
	private SITE: string = "http://ibigpro.com.br/";
	constructor
	(
		public http: Http,
		public file: FileDealer
	) {}
	// função que retorna a url que se encontra o webservice
	get_webservice_url()
	{
		return this.SITE + "app/webservice.php";
	}
	// função que retorna a url que se encontra as imagens do produto
	get_product_image_url(image)
	{
		// concatenando com a url passafa por parâmetro
		return this.SITE + "sistema/" + image;
	}
	// função que retorna a url que se encontra as imagens do perfil
	get_profile_image_url()
	{
		return this.SITE + "sistema/";
	}
	// função que retorna o request formado para ser enviado ao webservice
	criar_request(dados, acao)
	{
		// concatenando a ação
		var request = "?acao="+acao;
		// para cada dado da array
		dados.forEach(dado => 
		{
			// concatenando os dados
			request += "&"+dado.id+"="+dado.valor;
		});
		// retornando a request final
		return request;
	}
	// função que envia o request ao servidor
	envia_request(dados_request, acao_request, funcao_resolve, funcao_reject, context)
	{
		// criando o request
		var request = this.criar_request(dados_request, acao_request);
		// criando a url final
		let url : any = this.get_webservice_url()+request;
		// criando a promise da função
		let promise = new Promise(
		(resolve: (value?: any[]) => void, reject) => 
		{
			// realizando ao request
			this.http.get(url).map(res => res.json()).subscribe(resultado=>
			{
				funcao_resolve(resolve, reject, resultado, context);
			}, error => 
			{
				funcao_reject(reject, error, context);
			});
		});
		return promise;
	}
	// função que realiza o upload
	upload(dados_request, acao_request, funcao_resolve, funcao_reject, context, file_uri, file_name)
	{
		// recebendo as options do upload
		var file_options = this.file.get_file_upload_options_object(file_name);
		// criando request
		var request = this.criar_request(dados_request, acao_request);
		// criando url final
		let url : any = this.get_webservice_url()+request;
		// instanciando um objeto filetransfer
		const fileTransfer = this.file.get_file_transfer_object();
		// criando a promise da função
		let promise = new Promise(
		(resolve: (value?: any[]) => void, reject) => 
		{
			// fazer o upload do arquivo
			fileTransfer.upload(file_uri, url, file_options).then((resultado) => 
			{
				funcao_resolve(resolve, reject, resultado, context);
			}, 
			(error) => 
			{
				funcao_reject(reject, error, context);
			});
		});
		return promise;
	}
}