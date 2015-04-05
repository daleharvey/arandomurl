'use strict';

var request = require('request');
var config = require('./config.js');

module.exports.render = function render(tpl, data) {
  tpl = tpl.cloneNode(true);
  Object.keys(data).forEach(function(k) {
    var selector = k.split('-');
    var el = tpl.querySelector(selector[0]);
    if (el && selector.length > 1) {
      el[selector[1]] = data[k];
    } else if (el) {
      el.textContent = data[k];
    } else {
      console.error(selector, 'not found');
    }
  });
  return tpl;
};

module.exports.httpTpl = function(path) {
  if (!process.browser) {
    path = 'http://127.0.0.1:' + config.PORT + '/' + path;
  }
  return new Promise(function(resolve, reject) {
    request({
      method: 'GET',
      url: path
    }, function(err, args, data) {
      if (err) {
        return reject(err);
      }
      var frag = document.createDocumentFragment();
      var el = document.createElement('div');
      el.innerHTML = data;
      for (var i = 0; i < el.childNodes.length; i++) {
        frag.appendChild(el.childNodes[i]);
      }
      resolve(frag);
    });
  });
};
