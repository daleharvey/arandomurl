'use strict';

var marked = require('marked');

var utils = require('../utils.js');

module.exports = function(ctx) {
  return Promise.all([
    ctx.app.db.get(ctx.params.id),
    utils.httpTpl('/views/view-post.tpl')
  ]).then(function(res) {
    return utils.render(res[1], {
      '.title a': res[0].title,
      '.title a-href': '/edit/' + res[0]._id,
      '.post-innerHTML': marked(res[0].post),
      '.edit-href': '/edit/' + res[0]._id
    });
  });
};
