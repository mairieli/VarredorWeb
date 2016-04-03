var makeDom = require("./makeDom").makeDom;
var http = require('http');
var traversal = require('domutils');

var url = 'http://www.utfpr.edu.br/campomourao'
http.get(url, function(response) {
	main(response);
}).on('error', function(e) {
	console.log("Got error: " + e.message);
});

var main = function(response) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});
	response.on('end', function(chunk) {
		var dom = makeDom(data);

		var listaApresentacao = [];
		buscaDoms(dom, listaApresentacao, "class", "navTreeItem visualNoMarker navTreeFolderish section-o-campus")
		var element = listaApresentacao[0]
		var linkOCampus = traversal.getAttributeValue(element[1], "href")
		http.get(linkOCampus, function(response) {
			getTextoApresentacao(response)
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});

		var listaRodape = [];
		buscaDoms(dom, listaRodape, "id", "portal-footer")
		var elemento = listaRodape[0]
		var rodape = traversal.getChildren(elemento[1])
		console.log("======Endereço completo do Campus======")
		console.log(rodape[0].data)
		console.log("_______________________________________________________________________________")

		var listalnkNoticias = [];
		buscaDoms(dom, listalnkNoticias, "class", "tileHeadline")

		var element1 = listalnkNoticias[0]
		var link1 = traversal.getAttributeValue(element1[1], "href")
		http.get(link1, function(response) {
			getNoticiaInformacoes(response, true, link1)
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});

		var element2 = listalnkNoticias[1]
		var link2 = traversal.getAttributeValue(element2[1], "href")
		http.get(link2, function(response) {
			getNoticiaInformacoes(response, true, link2)
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});

		var element3 = listalnkNoticias[4]
		var link3 = traversal.getAttributeValue(element3[1], "href")
		http.get(link3, function(response) {
			getNoticiaInformacoes(response, false, link3)
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});

		var element4 = listalnkNoticias[5]
		var link4 = traversal.getAttributeValue(element4[1], "href")
		http.get(link4, function(response) {
			getNoticiaInformacoes(response, false, link4)
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});


		var element5 = listalnkNoticias[6]
		var link5 = traversal.getAttributeValue(element5[1], "href")
		http.get(link5, function(response) {
			getNoticiaInformacoes(response, false, link5)
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});


	});
}

var buscaDoms = function(dom, lista, tipo, atributo) {
	if (dom != null) {
		for (var i = 0; i < dom.length; i++) {
			if (traversal.getAttributeValue(dom[i], tipo) == atributo) {
				lista.push(traversal.getChildren(dom[i]));
			} else {
				buscaDoms(traversal.getChildren(dom[i]), lista, tipo, atributo);
			}
		}
	}
	return null;
}

var getNoticiaInformacoes = function(response, ehNoticia, link) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});
	response.on('end', function(chunk) {
		var dom = makeDom(data);
		var titulo = [];
		buscaDoms(dom, titulo, "id", "parent-fieldname-title")
		var elemento = titulo[0]
		console.log("\n======Título======")

		// Expressão regular - Regex e Replace
		// \s - qualquer espaço em branco
		// {2,} - em quantidade de dois ou mais
		// g - apanhar todas as ocorrências, não só a primeira
		// Substitui por ' '
		console.log(elemento[0].data.replace(/\s{2,}/g, ' '))

		if (!ehNoticia) {
			console.log("\n======Link======")
			console.log(link)
		}

		var texto = [];
		buscaDoms(dom, texto, "id", "parent-fieldname-text")

		var listaTexto = []
		buscaTextoNoticaiInformacoes(texto[0], listaTexto)
		var textoFinal = ""

		if(ehNoticia){
			var domTituloNoticiaNoTexto = []
			var tituloNoticiaNoTexto = []
			buscaDoms(dom, domTituloNoticiaNoTexto, "id", "parent-fieldname-description")
			buscaTextoNoticaiInformacoes(domTituloNoticiaNoTexto[0], tituloNoticiaNoTexto)
			textoFinal += tituloNoticiaNoTexto[0].replace(/\s{2,}/g, ' ')
		}

		for (valor in listaTexto) {
			if (ehNoticia) {
				if (valor != listaTexto.length - 2) {
					textoFinal += listaTexto[valor]
				}
			} else {
				textoFinal += listaTexto[valor]
			}
		}

		if (ehNoticia) {
			console.log("\n======Data======")
			console.log(listaTexto[listaTexto.length - 2])
		}

		console.log("\n======Texto======")
		console.log(textoFinal.replace(/\s{2,}/g, '\n'))
		console.log("_______________________________________________________________________________")
	});
}

var buscaTextoNoticaiInformacoes = function(dom, listaTexto) {
	if (dom != null) {
		for (var i = 0; i < dom.length; i++) {
			if (dom[i].data != null) {
				listaTexto.push(dom[i].data)
			} else {
				buscaTextoNoticaiInformacoes(traversal.getChildren(dom[i]), listaTexto);
			}
		}
	}
	return null;
}

var getTextoApresentacao = function(response) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});
	response.on('end', function(chunk) {
		var dom = makeDom(data);
		var retorno = [];
		buscaDoms(dom, retorno, "id", "parent-fieldname-text-84bff7d47dcef80d890fe2eb7c8d20bb")
		var elemento = retorno[0]
		var textoApresentacao = traversal.getChildren(elemento[3])
		console.log("\n======Texto de Apresentacao======")
		console.log(textoApresentacao[0].data)
		console.log("_______________________________________________________________________________")
	});
}

function imprimeTextoApresentacao(element, index, array) {
	var filho = traversal.getChildren(element[1])
	var texto = filho[0]
	console.log("Endereço completo do Campus: ")
	console.log(texto.data)
}