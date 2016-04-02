var makeDom = require("./makeDom").makeDom;
var http = require('http');
var traversal = require('domutils');

var url = 'http://www.utfpr.edu.br/campomourao'
http.get(url, function(response) {
	parseResponse(response);
}).on('error', function(e) {
	console.log("Got error: " + e.message);
});

var parseResponse = function(response) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});
	response.on('end', function(chunk) {
		var dom = makeDom(data);

		var listaApresentacao = [];
		busca(dom, listaApresentacao, "class", "navTreeItem visualNoMarker navTreeFolderish section-o-campus")
		var element = listaApresentacao[0]
		var linkOCampus = traversal.getAttributeValue(element[1], "href")
		http.get(linkOCampus, function(response) {
			getTextoApresentacao(response)
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});

		var listaRodape = [];
		busca(dom, listaRodape, "id", "portal-footer")
		var elemento = listaRodape[0]
		var rodape = traversal.getChildren(elemento[1])
		console.log("Endereço completo do Campus: ")
		console.log(rodape[0].data)

		var listalnkNoticias = [];
		busca(dom, listalnkNoticias, "class", "tileHeadline")
		var element1 = listalnkNoticias[0]
		var link1 = traversal.getAttributeValue(element1[1], "href")
		http.get(link1, function(response) {
			getNoticiaInformcoes(response)
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});

		var element2 = listalnkNoticias[1]
		var link2 = traversal.getAttributeValue(element2[1], "href")


		var element3 = listalnkNoticias[4]
		var link3 = traversal.getAttributeValue(element3[1], "href")


		var element4 = listalnkNoticias[5]
		var link4 = traversal.getAttributeValue(element4[1], "href")


		var element5 = listalnkNoticias[6]
		var link5 = traversal.getAttributeValue(element5[1], "href")


	});
}

var busca = function(dom, lista, tipo, atributo) {
	if (dom != null) {
		for (var i = 0; i < dom.length; i++) {
			if (traversal.getAttributeValue(dom[i], tipo) == atributo) {
				lista.push(traversal.getChildren(dom[i]));
			} else {
				busca(traversal.getChildren(dom[i]), lista, tipo, atributo);
			}
		}
	}
	return null;
}

var getNoticiaInformcoes = function(response) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});
	response.on('end', function(chunk) {
		var dom = makeDom(data);
		var retorno = [];
		busca(dom, retorno, "id", "parent-fieldname-title")
		var elemento = retorno[0]
		//var textoApresentacao = traversal.getChildren(elemento[3])
		console.log("\nTítulo: ")
		console.log(elemento[0].data)
		console.log("Texto: ")

	});
}

var getTextoApresentacao = function(response) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});
	response.on('end', function(chunk) {
		var dom = makeDom(data);
		var retorno = [];
		busca(dom, retorno, "id", "parent-fieldname-text-84bff7d47dcef80d890fe2eb7c8d20bb")
		var elemento = retorno[0]
		var textoApresentacao = traversal.getChildren(elemento[3])
		console.log("\nTexto de Apresentacao: ")
		console.log(textoApresentacao[0].data)
	});
}

function imprimeTextoApresentacao(element, index, array) {
	var filho = traversal.getChildren(element[1])
	var texto = filho[0]
	console.log("Endereço completo do Campus: ")
	console.log(texto.data)
}