var makeDom = require("./makeDom").makeDom;
var http = require('http');

var url = 'http://www.utfpr.edu.br/campomourao'
http.get(url, function(response) {
  	parseResponse(response);
})

var parseResponse = function(response) {
	var data = "";
	response.on('data', function(chunk) {
    		data += chunk;
  	});
    	response.on('end', function(chunk) {
       		var dom = makeDom(data);
       		console.log(dom);
    	});
 }
