var htmlparser = require("htmlparser2");
var domutils = require('domutils');


exports.getTreeDom = function(markup) {
	var handler = new htmlparser.DomHandler();
	var parser = new htmlparser.Parser(handler);
	parser.write(markup);
	parser.done();
	return handler.dom;
};

var getNodesDom = exports.getNodesDom = function(dom, lista, tipo, atributo) {
	if (dom) {
		for (var i = 0; i < dom.length; i++) {
			if (domutils.getAttributeValue(dom[i], tipo) == atributo) {
				lista.push(domutils.getChildren(dom[i]));
			} else {
				getNodesDom(domutils.getChildren(dom[i]), lista, tipo, atributo);
			}
		}
	}
	return null;
};
