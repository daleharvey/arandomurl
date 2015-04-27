'use strict';

var utils = require('../utils.js');
var dateformat = require('dateformat');

module.exports = function(ctx) {
  var tpl, div = ctx.document.createElement('div');
  div.setAttribute('class', 'archives');
  return new Promise(function(resolve) {
    utils.httpTpl(ctx.document, '/views/archive-row.tpl').then(function(_tpl) {
      tpl = _tpl;
      return ctx.app.db.createIndex({index: {fields: ['posted']}});
    }).then(function() {
      return ctx.app.db.find({
        selector: {posted: {$exists: true}},
        sort: [{posted: 'desc'}]
      });
    }).then(function(res) {
      var currentHeader = '';
      res.docs.forEach(function(row) {
        var newHeader = dateformat(new Date(row.posted), 'mmmm yyyy');
        if (newHeader !== currentHeader) {
          var header = ctx.document.createElement('h3');
          header.textContent = newHeader;
          currentHeader = newHeader;
          div.appendChild(header);
        }
        div.appendChild(utils.render(tpl, {
          'a-href': '/post/' + row._id,
          '.title': row.title,
          '.date': dateformat(new Date(row.posted), 'dS mmmm yyyy')
        }));
      });
      resolve(div);
    });
  });
};
