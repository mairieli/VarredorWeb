var treeDom = require("./treeDom");
var domutils = require('domutils');
var request = require("request");

exports.parserHtml = function(url) {
	request(url, function(error, response, body) {
		var dom = treeDom.getTreeDom(body);

		imprimeNoticiasInformacoes(dom);
	});
};

/*
 * Imprime o texto de apresentação que está dentro do link "O CÂMPUS"
 */
function imprimeApresentacao(dom) {
	var listaApresentacao = [];
	treeDom.getNodesDom(dom, listaApresentacao, "class", "navTreeItem visualNoMarker navTreeFolderish section-o-campus");
	var domApresentacao = listaApresentacao[0];
	var linkOCampus = domutils.getAttributeValue(domApresentacao[1], "href");

	request(linkOCampus, function(error, response, body) {
		var dom = treeDom.getTreeDom(body);

		var retorno = [];
		treeDom.getNodesDom(dom, retorno, "id", "parent-fieldname-text-84bff7d47dcef80d890fe2eb7c8d20bb");

		var domTextoApresentacao = retorno[0];
		var textoApresentacao = domutils.getChildren(domTextoApresentacao[3]);

		console.log("\n======Texto de Apresentacao======");
		console.log(textoApresentacao[0].data);
		imprimeSeparador();

		imprimeRodape(dom);
	});
}

/*
 * Imprime o endereço completo do campus, que está no rodapé
 */
function imprimeRodape(dom) {
	var listaRodape = [];
	treeDom.getNodesDom(dom, listaRodape, "id", "portal-footer");

	var domRodape = listaRodape[0];
	var rodape = domutils.getChildren(domRodape[1]);

	console.log("\n======Endereço completo do Campus======");
	console.log(rodape[0].data);
	imprimeSeparador();
}

/*
 * Imprime as ultimas notícias e informações institucuinais
 */
function imprimeNoticiasInformacoes(dom) {
	var listaDomsNoticias = [];
	treeDom.getNodesDom(dom, listaDomsNoticias, "class", "tileHeadline");

	// remove os nós que contem os links das notícias/informações que não serão exibidas
	listaDomsNoticias.splice(2, 2);
	listaDomsNoticias.splice(5, 3);

	getNoticiaInformacoes(listaDomsNoticias, 0, dom);
}

function getNoticiaInformacoes(listaDomsNoticias, indice, domIncial) {
	if (indice >= 5) {
		imprimeApresentacao(domIncial);
	} else {

		var domNoticia = listaDomsNoticias[indice];
		var link = domutils.getAttributeValue(domNoticia[1], "href");

		request(link, function(error, response, body) {
			var dom = treeDom.getTreeDom(body);
			var titulo = [];
			treeDom.getNodesDom(dom, titulo, "id", "parent-fieldname-title");

			var domTitulo = titulo[0];
			console.log("\n======Título======");

			console.log(domTitulo[0].data.replace(/\s{2,}/g, ' '));

			if (indice > 1) {
				console.log("\n======Link======");
				console.log(link);
			}

			var texto = [];
			treeDom.getNodesDom(dom, texto, "id", "parent-fieldname-text");

			var listaTexto = [];
			buscaTextoNoticiaInformacoes(texto[0], listaTexto);
			var textoFinal = "";

			if (indice <= 1) {
				var domTituloNoticiaNoTexto = [];
				var tituloNoticiaNoTexto = [];
				treeDom.getNodesDom(dom, domTituloNoticiaNoTexto, "id", "parent-fieldname-description");
				buscaTextoNoticiaInformacoes(domTituloNoticiaNoTexto[0], tituloNoticiaNoTexto);
				textoFinal += tituloNoticiaNoTexto[0].replace(/\s{2,}/g, ' ');
			}

			for (var valor in listaTexto) {
				if (indice <= 1) {
					if (valor != listaTexto.length - 2) {
						textoFinal += listaTexto[valor];
					}
				} else {
					textoFinal += listaTexto[valor];
				}
			}

			if (indice <= 1) {
				console.log("\n======Data======");
				console.log(listaTexto[listaTexto.length - 2]);
			}

			console.log("\n======Texto======");
			console.log(textoFinal.replace(/\s{2,}/g, '\n'));
			imprimeSeparador();

			getNoticiaInformacoes(listaDomsNoticias, indice + 1, domIncial);

		});
	}
}

function buscaTextoNoticiaInformacoes(dom, listaTexto) {
	if (dom) {
		for (var i = 0; i < dom.length; i++) {
			if (dom[i].data) {
				listaTexto.push(dom[i].data);
			} else {
				buscaTextoNoticiaInformacoes(domutils.getChildren(dom[i]), listaTexto);
			}
		}
	}
	return null;
}

function imprimeSeparador() {
	console.log("_______________________________________________________________________________");
}