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
	var tematribs = traversal.getChildren(dom[3]);
	console.log(tematribs);
    	});
 }
