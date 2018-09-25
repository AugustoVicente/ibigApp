import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
@Injectable()
// classe que lida com os arquivos
export class FileDealer
{
    // variável que recebe o diretório interno de armazenamento
    private uri = this.file.externalDataDirectory;
    // configurações para pegar as imagens da galeria
	private options : CameraOptions = 
	{
		quality: 100,
		destinationType: this.camera.DestinationType.DATA_URL, 
		encodingType: this.camera.EncodingType.JPEG, // codificar como jpeg
		mediaType: this.camera.MediaType.PICTURE,
		sourceType: 0 // pesquisa na galeria
	}
    constructor
    (
        private transfer: FileTransfer,
        private fileOpener: FileOpener,
        private file: File, 
		private camera: Camera
    ) {}
    // função que retorna um objeto upload options
    get_file_upload_options_object(file_name)
    {
        // criando objeto de FileTransfer
        var options: FileUploadOptions = 
		{
			fileKey: 'file',
			fileName: file_name+'.jpeg',
			chunkedMode: false,
			mimeType: "image/jpeg",
			headers: {}
		}
        return options;
    }
     // função que retorna um objeto filetransfer
    get_file_transfer_object()
    {
        // criando objeto de FileTransfer
        const fileTransfer: FileTransferObject = this.transfer.create();
        return fileTransfer;
    }
    // funcao que pega uma foto na galeria
    getPicture(function_resolve, function_reject, context)
    {
        // abrindo a galeria
        this.camera.getPicture(this.options).then(
        (imageData) => 
        {
            // executando funcao de confirmação
            function_resolve(imageData, context);
        }, 
		(err) => 
		{
            // executando funcao de rejeição
			function_reject(context);
		});
    }
    // função que realiza o download de algum arquivo
    download(function_resolve, function_reject, url, id_compra, loading, context)
    {
        // criando uri a partir do boleto de compra
        var uri = this.uri + 'Boleto_compra-'+id_compra+'.pdf';
        // criando objeto de FileTransfer
        const fileTransfer: FileTransferObject = this.transfer.create();
        // fazendo o download do boleto com o respectivo boleto selecionado
        fileTransfer.download(url, uri).then((entry) => 
        {
            // executando funcao de confirmação
            function_resolve(context, id_compra, loading);
        }, (error) => 
        {
            // executando funcao de rejeição
            function_reject(context, loading, error);
        });
    }
    // função que realiza a abertura de um documento
    open(function_resolve, function_reject, id_compra, loading, context)
    {
        // criando uri a partir do boleto de compra
        var uri = this.uri + 'Boleto_compra-'+id_compra+'.pdf';
        // abrindo o documento
        this.fileOpener.open(uri, 'application/pdf').then(() =>
        {
            // executando funcao de confirmação
            function_resolve(loading);
        }).catch(e => 
        {
            // executando funcao de rejeição
           function_reject(context, loading);
        });
    }
}