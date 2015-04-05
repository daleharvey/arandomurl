'use strict';

var utils = require('../utils.js');

var fetched;

function autoResize(dom) {
  var resizingTextareas = [].slice.call(
    dom.querySelectorAll('textarea[autoresize=true]'));

  resizingTextareas.forEach(function(textarea) {
    textarea.addEventListener('input', autoresize, false);
    // TODO: probably broken, settimeout yields so we wait until the textarea has
    // probably been rendered to the dom (not in the fragment) before calculating
    // its height
    setTimeout(function() {
      autoresize.call(textarea);
    });
  });

  function autoresize() {
    this.style.height = 'auto';
    if (this.scrollHeight) {
      this.style.height = this.scrollHeight + 'px';
    }
    this.scrollTop = this.scrollHeight;
    window.scrollTo(window.scrollLeft, (this.scrollTop + this.scrollHeight));
  }
}


function previewPostClicked(dom) {

  var btn = document.querySelector('#previewPost');
  var input = document.querySelector('#postInput');
  var preview = document.querySelector('#postPreview');

  if (!input.hidden) {
    btn.value = 'Edit Post';
    input.hidden = true;
    preview.innerHTML = marked(input.value);
    preview.hidden = false;
  } else {
    btn.value = 'Preview Post';
    preview.hidden = true;
    input.hidden = false;
  }
}


function deleteClicked(dom, ctx) {
  ctx.app.db.remove({
    _id: fetched._id,
    _rev: fetched._rev
  }).then(function() {
    document.location.href = '/archive/';
  });
}


function newPostSubmitted(dom, ctx, e) {
  e.preventDefault();
  var title = document.getElementById('postTitle').value.trim();
  var post = document.getElementById('postInput').value.trim();
  var url = document.getElementById('postUrl').value.trim();

  if (!title || !post) {
    return alert('Need some more datas');
  }

  var doc = fetched || {};
  doc._id = url;
  doc.title = title;
  doc.post = post;
  if (!('posted' in doc)) {
    doc.posted = Date.now();
  }

  ctx.app.db.put(doc).then(function() {
    document.location.href = '/post/' + doc._id;
  });
}


function titleChanged(dom, e) {
  document.querySelector('#postUrl').value = e.target.value.replace(/ /g, '-');
}


function addEvents(dom, ctx) {
  autoResize(dom);
  dom.querySelector('#postTitle')
    .addEventListener('input', titleChanged.bind(this, dom));
  dom.querySelector('#deletePost')
    .addEventListener('click', deleteClicked.bind(this, dom, ctx));
  dom.querySelector('#previewPost')
    .addEventListener('click', previewPostClicked.bind(this, dom));
  dom.querySelector('#newPost')
    .addEventListener('submit', newPostSubmitted.bind(this, dom, ctx));
}


function addData(dom, ctx) {

  if (!ctx.params.id) {
    return Promise.resolve(dom);
  }

  return ctx.app.db.get(ctx.params.id).then(function(doc) {
    fetched = doc;
    return utils.render(dom, {
      '#postTitle-value': doc.title,
      '#postInput': doc.post,
      '#postUrl-value': doc._id
    });
  });
}

module.exports = function(ctx) {
  return new Promise(function(resolve) {
    utils.httpTpl('/views/post.tpl').then(function(dom) {
      addData(dom, ctx).then(function(dom) {
        addEvents(dom, ctx);
        resolve(dom);
      });
    });
 });
};
