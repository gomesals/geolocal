ready(getPosition());
/**
 * Executa a funcao quando a pagina estiver pronta
 *
 * @param      {Function}  fn      Funcao para executar
 * @return     {Function}    A funcao
 */
function ready(fn) {
	if (document.readyState != 'loading') {
		return fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}
/**
 * Pede permissao para usar a API de geolocalizacao. Se for autorizada, recebe os dados da mesma e executa a funcao `load`.
 */
function getPosition() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(load);
	}
}
/**
 * Carrega dados da posicao, como nome de estado, pais.. E executa a funcao `treat` como callback
 *
 * @param      {Object}  position  Objeto da posicao
 */
function load(position) {
	var url = "https://nominatim.openstreetmap.org/reverse?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&format=json&json_callback=treat";
	var script = document.createElement('script');
	script.src = url;
	document.body.appendChild(script);
}
/**
 * Trata os dados recebidas pelo OpenStreetMap
 *
 * @param      {Object}  data    Valores relacionados a posicao, como estado, cidade, regiao..
 */
function treat(data) {
	var state = removeAccents(data.address.state.toLowerCase());
	var link = getOptions(state);
	// Se o estado identificado possuir uma pagina especifica para o redirect, depois de 2,5 segundos uma div aparece para informar a opcao
	if (link[1]) {
		setTimeout(function() {
			createDiv(link[0], data.address.state);
		}, 2500);
	}
}
/**
 * Remove os acentos para maior compatibilidade
 *
 * @param      {string}  string  Palavra
 * @return     {string}  Palavra sem acento
 */
function removeAccents(string) {
	var accents = {
		a: /[\xE0-\xE6]/g,
		e: /[\xE8-\xEB]/g,
		i: /[\xEC-\xEF]/g,
		o: /[\xF2-\xF6]/g,
		u: /[\xF9-\xFC]/g,
		c: /\xE7/g,
		n: /\xF1/g,
		'': /\s/g
	};
	for (var letter in accents) {
		var regex = accents[letter];
		string = string.replace(regex, letter);
	}
	return string;
}
/**
 * Resolve o complemento da URL de redirecionamento do estado, e se o mesmo possui uma pagina especifica.
 *
 * @param      {<type>}  from    The from
 * @return     {<type>}  The options.
 */
function getOptions(from) {
	// "estado": ["ComplementoDaUrl", possuiPagina]
	var states = {
		"acre": ["ac", false],
		"alagoas": ["al", false],
		"amazonas": ["am", true],
		"amapa": ["ap", false],
		"bahia": ["ba", false],
		"ceara": ["ce", true],
		"distritofederal": ["df", false],
		"espiritosanto": ["es", false],
		"goias": ["go", false],
		"maranhao": ["ma", false],
		"minasgerais": ["mg", false],
		"matogrossodosul": ["ms", false],
		"matogrosso": ["mt", false],
		"para": ["pa", false],
		"paraiba": ["pb", false],
		"pernambuco": ["pr", false],
		"piaui": ["pi", false],
		"parana": ["pr", false],
		"riodejaneiro": ["rj", false],
		"riograndedonorte": ["rn", false],
		"rondonia": ["ro", false],
		"roraima": ["rr", false],
		"riograndedosul": ["rs", false],
		"santacatarina": ["sc", false],
		"sergipe": ["se", false],
		"saopaulo": ["sp", true],
		"tocantins": ["to", false]
	};
	return states[from];
}
/**
 * Cria a div responsavel por exibir a opcao de redirecionamento
 *
 * @param      {string}  to      URL de redirecionamento
 * @param      {string}  state   Nome do estado
 */
function createDiv(to, state) {
	// Link para ser redirecionado
	var link = "https://borala.com.br/" + to + "/index.php";
	var div = document.createElement('div');
	// Estilizacao da div
	div.style.textAlign = "center";
	div.style.width = "98.5%";
	div.style.position = "absolute";
	div.style.top = "0";
	div.style.left = "0";
	div.style.backgroundColor = "#fff";
	div.style.color = "#222";
	div.style.padding = "10px";
	div.style.borderBottom = "1px solid #ddd";
	div.innerHTML = "Possuímos uma página dedicada ao seu estado <strong>" + state + "</strong>. <a href='" + link + "'>Acessar</a>";
	// Insercao no DOM e correcao de posicionamento
	document.body.appendChild(div);
	document.body.style.marginTop = "50px";
}