'use strict';

var marked = require('marked');
var hljs = require('highlight.js');

var utils = require('../utils.js');

var renderer = new marked.Renderer();
renderer.code = function(code, language) {
  language = language || 'js';
  return '<pre><code class="hljs ' + language + '">' +
    hljs.highlight(language, code).value +
    '</code></pre>';
};

module.exports = function(ctx) {
  return new Promise(function(resolve) {
    var tpl;
    var frag = global.document.createDocumentFragment();
    utils.httpTpl('/views/view-post.tpl').then(function(_tpl) {
      tpl = _tpl;
      return ctx.app.db.createIndex({index: {fields: ['posted']}});
    }).then(function () {
      return ctx.app.db.find({
        selector: {posted: {$exists: true}},
        sort: [{posted: 'desc'}],
        limit: 5
      });
    }).then(function(result) {
      result.docs.forEach(function(doc) {
        frag.appendChild(utils.render(tpl, {
          '.title a': doc.title,
          '.title a-href': '/post/' + doc._id,
          '.post-innerHTML': marked(doc.post, {renderer: renderer}),
          '.edit-href': '/edit/' + doc._id
        }));
      });
      resolve(frag);
    });
  });
};
