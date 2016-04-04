var treeDom = require("./treeDom");
var http = require('http');
var domutils = require('domutils');

var main = function(response) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});
	response.on('end', function(chunk) {
		var dom = treeDom.getTreeDom(data);

		imprimeTextoApresentacao(dom);

		imprimeRodape(dom);

		imprimeNoticiasInformacoes(dom);
	});
};

var imprimeTextoApresentacao = function(dom) {
	var listaApresentacao = [];
	treeDom.getNodesDom(dom, listaApresentacao, "class", "navTreeItem visualNoMarker navTreeFolderish section-o-campus");
	var element = listaApresentacao[0];
	var linkOCampus = domutils.getAttributeValue(element[1], "href");
	http.get(linkOCampus, function(response) {
		getTextoApresentacao(response);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};

var imprimeRodape = function(dom) {
	var listaRodape = [];
	treeDom.getNodesDom(dom, listaRodape, "id", "portal-footer");
	var elemento = listaRodape[0];
	var rodape = domutils.getChildren(elemento[1]);
	console.log("======Endereço completo do Campus======");
	console.log(rodape[0].data);
	console.log("_______________________________________________________________________________");
};

var imprimeNoticiasInformacoes = function(dom) {
	var listalnkNoticias = [];
	treeDom.getNodesDom(dom, listalnkNoticias, "class", "tileHeadline");
	listalnkNoticias.splice(2, 2);
	listalnkNoticias.splice(5, 3);
	for (var i = 0; i < listalnkNoticias.length; i++) {
		var elemento = listalnkNoticias[i];
		if (i > 1) {
			imprimeInformacoesInstitucionais(elemento);
		} else {
			imprimeNoticia(elemento);
		}
	}
};

var imprimeNoticia = function(elemento) {
	var link = domutils.getAttributeValue(elemento[1], "href");
	http.get(link, function(response) {
		getNoticiaInformacoes(response, true, link);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});

};

var imprimeInformacoesInstitucionais = function(elemento) {
	var link = domutils.getAttributeValue(elemento[1], "href");
	http.get(link, function(response) {
		getNoticiaInformacoes(response, false, link);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};

function imprimeTextoApresentacao(element, index, array) {
	var filho = domutils.getChildren(element[1]);
	var texto = filho[0];
	console.log("Endereço completo do Campus: ");
	console.log(texto.data);
};

var getNoticiaInformacoes = function(response, ehNoticia, link) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});
	response.on('end', function(chunk) {
		var dom = treeDom.getTreeDom(data);
		var titulo = [];
		treeDom.getNodesDom(dom, titulo, "id", "parent-fieldname-title");
		var elemento = titulo[0];
		console.log("\n======Título======");

		// Expressão regular - Regex e Replace
		// \s - qualquer espaço em branco
		// {2,} - em quantidade de dois ou mais
		// g - apanhar todas as ocorrências, não só a primeira
		// Substitui por ' '
		console.log(elemento[0].data.replace(/\s{2,}/g, ' '));

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
		console.log("_______________________________________________________________________________");
	});
};

var buscaTextoNoticiaInformacoes = function(dom, listaTexto) {
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
};

var getTextoApresentacao = function(response) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});
	response.on('end', function(chunk) {
		var dom = treeDom.getTreeDom(data);
		var retorno = [];
		treeDom.getNodesDom(dom, retorno, "id", "parent-fieldname-text-84bff7d47dcef80d890fe2eb7c8d20bb");
		var elemento = retorno[0];
		var textoApresentacao = domutils.getChildren(elemento[3]);
		console.log("\n======Texto de Apresentacao======");
		console.log(textoApresentacao[0].data);
		console.log("_______________________________________________________________________________");
	});
};

exports.parserHtml = function(url) {
	http.get(url, function(response) {
		main(response);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};