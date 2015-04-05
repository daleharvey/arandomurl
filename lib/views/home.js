'use strict';

var marked = require('marked');

var utils = require('../utils.js');

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
          '.post-innerHTML': marked(doc.post),
          '.edit-href': '/edit/' + doc._id
        }));
        resolve(frag);
      });
    });
  });
};
