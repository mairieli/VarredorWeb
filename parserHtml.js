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

		var lista = [];
		busca(dom, lista, "class", "tileItem visualIEFloatFix")

		function logArray(element, index, array){
			console.log(element)
			console.log("---------------------")
		}

		lista.forEach(logArray);

		var lista2 = [];
		busca(lista[5], lista2, "class", "tileHeadline")

		lista2.forEach(logArray);
		//console.log(x)
			
	});
}

var busca = function(dom, lista, tipo, atributo){
	if(dom != null){
		for(var i = 0; i < dom.length; i++){
			if(traversal.getAttributeValue(dom[i], tipo) == atributo){
				lista.push(traversal.getChildren(dom[i]));
			} else {
				busca(traversal.getChildren(dom[i]), lista, tipo, atributo);
			}
		}
	}
	return null;
}