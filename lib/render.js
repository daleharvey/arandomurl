'use strict';

var renderQueue = Promise.resolve();

function renderBrowser(to, module) {
  return function(ctx, next) {
    renderQueue = renderQueue.then(function() {
      return module(ctx);
    }).then(function(dom) {
      if (typeof to === 'string') {
        to = document.querySelector(to);
      }
      if (typeof dom === 'string') {
        to.innerHTML = dom;
      } else if (dom) {
        to.innerHTML = '';
        to.appendChild(dom);
      }
      if (next) {
        next();
      }
      return Promise.resolve();
    });
  };
};

function renderNode(to, view) {
  return function(req, res, next) {
    req.ctx.params = req.params;
    view(req.ctx).then(function(dom) {
      var el = req.ctx.document.querySelector(to);
      el.innerHTML = '';
      el.appendChild(dom);
      req.handled = true;
      next();
    });
  };
};

if (process.browser) {
  module.exports = renderBrowser;
} else {
  module.exports = renderNode;
}
