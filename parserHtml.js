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
		
		var tag = traversal.getChildren(dom[3]);
		var tag2 = traversal.getChildren(tag[3]);
		var tag3 = traversal.getChildren(tag2[1]);
		var tag4 = traversal.getChildren(tag3[5]);
		var tag5 = traversal.getChildren(tag4[3]);
		var tag6 = traversal.getChildren(tag5[1]);
		var tag7 = traversal.getChildren(tag6[3]);
		var tag8 = traversal.getChildren(tag7[7]);
		var tag9 = traversal.getChildren(tag8[1]);
		var tag10 = traversal.getChildren(tag9[1]);
		var tag11 = traversal.getChildren(tag10[1]);
		var tag12 = traversal.getChildren(tag11[1]);
		var tag13 = traversal.getChildren(tag12[1]);
		var tag14 = traversal.getChildren(tag13[1]);
		var tag15 = traversal.getChildren(tag14[1]);
		var tag16 = traversal.getChildren(tag15[1]);
		var tag17 = traversal.getChildren(tag16[5]);

		var linkNoticia1 = traversal.getAttributeValue(tag17[1], "href");
		console.log(linkNoticia1);

		var tag18 = traversal.getChildren(tag16[7]);
		var linkNoticia2 = traversal.getAttributeValue(tag18[1], "href");
		console.log(linkNoticia2);
	});
}
