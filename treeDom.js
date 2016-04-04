var htmlparser = require("htmlparser2");
var domutils = require('domutils');

/*
 * Recebe o html da página, faz o parse dos dados e retorna uma árvore DOM
 */
exports.getTreeDom = function(data) {
	var handler = new htmlparser.DomHandler();
	var parser = new htmlparser.Parser(handler);
	parser.write(data);
	parser.done();
	return handler.dom;
};

/*
 * Percorre os nós de uma árvore DOM, procurando filho que possui o atributo
 * e nome especificados por parâmetro.
 */
var getNodesDom = exports.getNodesDom = function(dom, lista, nome, atributo) {
	if (dom) {
		for (var i = 0; i < dom.length; i++) {
			if (domutils.getAttributeValue(dom[i], nome) == atributo) {
				lista.push(domutils.getChildren(dom[i]));
			} else {
				getNodesDom(domutils.getChildren(dom[i]), lista, nome, atributo);
			}
		}
	}
	return null;
};