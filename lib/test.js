'use strict';

var jsdom = require('jsdom').jsdom;

var document = jsdom('<html><body><div id="foo">foo</div></body></html>');

var tpl = document.createDocumentFragment();
var p = document.createElement('p');
p.innerHTML = 'hello <em>stuff</em>';

tpl.appendChild(p);
document.getElementById('foo').appendChild(tpl);

console.log(document.documentElement.outerHTML);

