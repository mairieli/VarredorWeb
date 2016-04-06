var treeDom = require("./treeDom");
var http = require('http');
var domutils = require('domutils');
var events = require('events'); 

emissorEvento = new events.EventEmitter();

function main(response) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});
	response.on('end', function(chunk) {
		var dom = treeDom.getTreeDom(data);

		imprimeApresentacao(dom);

		imprimeNoticiasInformacoes(dom);

		emissorEvento.on('rodape', imprimeRodape(dom));
	});
}

/*
 * Imprime o texto de apresentação que está dentro do link "O CÂMPUS"
 */
function imprimeApresentacao(dom) {
	var listaApresentacao = [];
	treeDom.getNodesDom(dom, listaApresentacao, "class", "navTreeItem visualNoMarker navTreeFolderish section-o-campus");

	var domApresentacao = listaApresentacao[0];
	var linkOCampus = domutils.getAttributeValue(domApresentacao[1], "href");

	http.get(linkOCampus, function(response) {
		getTextoApresentacao(response, dom);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

/*
 * Imprime o endereço completo do campus, que está no rodapé
 */
function imprimeRodape(dom) {
	var listaRodape = [];
	treeDom.getNodesDom(dom, listaRodape, "id", "portal-footer");

	var domRodape = listaRodape[0];
	var rodape = domutils.getChildren(domRodape[1]);

	console.log("======Endereço completo do Campus======");
	console.log(rodape[0].data);
	
}

/*
 * Imprime as ultimas notícias e informações institucuinais
 */
function imprimeNoticiasInformacoes(dom) {
	var listaDomsNoticias = [];
	treeDom.getNodesDom(dom, listaDomsNoticias, "class", "tileHeadline");

	// remove os nós que contem os links das notícias/informações que não serão exibidas
	listaDomsNoticias.splice(2, 2);
	listaDomsNoticias.splice(5, 3);

	// Percorre a lista dos nós que contem os links e chama a função para imprimir os dados.
	for (var i = 0; i < listaDomsNoticias.length; i++) {
		var domNoticia = listaDomsNoticias[i];
		if (i > 1) {
			imprimeInformacoesInstitucionais(domNoticia);
		} else {
			imprimeNoticia(domNoticia);
		}
	}
}

function imprimeNoticia(elemento) {
	var link = domutils.getAttributeValue(elemento[1], "href");

	http.get(link, function(response) {
		getNoticiaInformacoes(response, true, link);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

function imprimeInformacoesInstitucionais(elemento) {
	var link = domutils.getAttributeValue(elemento[1], "href");

	http.get(link, function(response) {
		getNoticiaInformacoes(response, false, link);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

function getNoticiaInformacoes(response, ehNoticia, link) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});

	response.on('end', function(chunk) {
		var dom = treeDom.getTreeDom(data);
		var titulo = [];
		treeDom.getNodesDom(dom, titulo, "id", "parent-fieldname-title");

		var domTitulo = titulo[0];
		console.log("\n======Título======");

		// Expressão regular - Regex e Replace
		// \s - qualquer espaço em branco
		// {2,} - em quantidade de dois ou mais
		// g - apanhar todas as ocorrências, não só a primeira
		// Substitui por ' '
		console.log(domTitulo[0].data.replace(/\s{2,}/g, ' '));

		if (!ehNoticia) {
			console.log("\n======Link======");
			console.log(link);
		}

		var texto = [];
		treeDom.getNodesDom(dom, texto, "id", "parent-fieldname-text");

		var listaTexto = [];
		buscaTextoNoticiaInformacoes(texto[0], listaTexto);
		var textoFinal = "";

		if (ehNoticia) {
			var domTituloNoticiaNoTexto = [];
			var tituloNoticiaNoTexto = [];
			treeDom.getNodesDom(dom, domTituloNoticiaNoTexto, "id", "parent-fieldname-description");
			buscaTextoNoticiaInformacoes(domTituloNoticiaNoTexto[0], tituloNoticiaNoTexto);
			textoFinal += tituloNoticiaNoTexto[0].replace(/\s{2,}/g, ' ');
		}

		for (var valor in listaTexto) {
			if (ehNoticia) {
				if (valor != listaTexto.length - 2) {
					textoFinal += listaTexto[valor];
				}
			} else {
				textoFinal += listaTexto[valor];
			}
		}

		if (ehNoticia) {
			console.log("\n======Data======");
			console.log(listaTexto[listaTexto.length - 2]);
		}

		console.log("\n======Texto======");
		console.log(textoFinal.replace(/\s{2,}/g, '\n'));
		imprimeSeparador();
	});
}

function buscaTextoNoticiaInformacoes(dom, listaTexto) {
	if (dom) {
		for (var i = 0; i < dom.length; i++) {
			if (dom[i].data) {
				listaTexto.push(dom[i].data);
			} else {
				buscaTextoNoticiaInformacoes(domutils.getChildren(dom[i]), listaTexto);
			}
		}
	}
	return null;
}

function getTextoApresentacao(response, dom) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});

	response.on('end', function(chunk) {
		var dom = treeDom.getTreeDom(data);

		var retorno = [];
		treeDom.getNodesDom(dom, retorno, "id", "parent-fieldname-text-84bff7d47dcef80d890fe2eb7c8d20bb");

		var domTextoApresentacao = retorno[0];
		var textoApresentacao = domutils.getChildren(domTextoApresentacao[3]);

		console.log("\n======Texto de Apresentacao======");
		console.log(textoApresentacao[0].data);
		imprimeSeparador();

		emissorEvento.emit('rodape');
	});
}

function imprimeSeparador(){
	console.log("_______________________________________________________________________________");
}

exports.parserHtml = function(url) {
	http.get(url, function(response) {
		main(response);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};