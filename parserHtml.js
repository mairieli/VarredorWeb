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
		//busca(dom, lista, "class", "tileHeadline")

		function logArray(element, index, array) {
			var filhote = traversal.getChildren(element[1])
			console.log("Endereço completo do Campus: ")
			console.log(filhote[0].data)
		}
		var lista = [];
		busca(dom, lista, "id", "portal-footer")
		lista.forEach(logArray);

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

var getRodape = function(response) {
	var data = "";
	response.on('data', function(chunk) {
		data += chunk;
	});
	response.on('end', function(chunk) {
		var dom = makeDom(data);

		console.log(dom);
	});
}