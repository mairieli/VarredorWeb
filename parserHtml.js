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
	var filhote = traversal.getChildren(element[1])
	console.log("Endereço completo do Campus: ")
	console.log(filhote[0].data)
}