import { Injectable } from '@angular/core';
@Injectable()
// classe de funções aleatórias
export class Utilidades
{
	constructor() {}
	//função que transforma uma data dateTime para dd/mm/aaaa
	transforma_to_date(data: string) 
	{
		var dia: string = data.substring(8, 10);
		var mes: string = data.substring(5, 7);
		var ano: string = data.substring(0, 4);
		data = dia + '/' + mes + '/' + ano;
		return data;
	}
	//função que transforma uma data dateTime para dd/mm/aaaa
	transforma_to_date_contrario(data: string) 
	{
		var dia: string = data.substring(0, 2);
		var mes: string = data.substring(3, 5);
		var ano: string = data.substring(6, 10);
		data = ano + '-' + mes + '-' + dia;
		return data;
	}
	// função que retorna true se um campo é inválido e false se não for
    valida_campo(campo)
	{
		if(campo == null || campo == "" || campo == undefined || campo == 0){return true;}
		else{return false}
	}
	// função que transforna um número qualquer para preço brasileiro (reais)
	transforma_to_preco(preco)
	{
		/* convertendo o preço para float, deixa com duas casas decimais fixas, 
		convertendo para string, substituindo o ponto por vírgula e adiconando o prefixo R$*/
		var strPreco = "R$ " + parseFloat(preco).toFixed(2).toString().replace(".", ",");
		// retornando o resultado
		return strPreco;
	}
}