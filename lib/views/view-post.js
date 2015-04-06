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
  return Promise.all([
    ctx.app.db.get(ctx.params.id),
    utils.httpTpl('/views/view-post.tpl')
  ]).then(function(res) {
    return utils.render(res[1], {
      '.title a': res[0].title,
      '.title a-href': '/edit/' + res[0]._id,
      '.post-innerHTML': marked(res[0].post, {renderer: renderer}),
      '.edit-href': '/edit/' + res[0]._id
    });
  });
};
