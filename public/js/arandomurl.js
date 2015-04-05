// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js').then(function(registration) {
//     console.log('ServiceWorker registration successful');
//   }).catch(function(err) {
//     console.log('ServiceWorker registration failed: ', err);
//   });
// }

var Arandomurl = function() {

  var DB_NAME = 'arandomurl';

  this.db = new PouchDB(DB_NAME);
  this.init();
};

// Auto resize textareas as the user types
Arandomurl.prototype.autoResizer = function() {

  var resizingTextareas = [].slice.call(
    document.querySelectorAll('textarea[autoresize=true]'));

  resizingTextareas.forEach(function(textarea) {
    textarea.addEventListener('input', autoresize, false);
    autoresize.call(textarea);
  });

  function autoresize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    this.scrollTop = this.scrollHeight;
    window.scrollTo(window.scrollLeft, (this.scrollTop + this.scrollHeight));
  }
};

Arandomurl.prototype.init = function() {
  this.autoResizer();

  document.getElementById('previewPost')
    .addEventListener('click', this.previewPostClicked.bind(this));

  document.getElementById('newPost')
    .addEventListener('submit', this.newPostSubmitted.bind(this));
};

Arandomurl.prototype.newPostSubmitted = function(e) {
  e.preventDefault();
  var title = document.getElementById('postTitle').value.trim();
  var post = document.getElementById('postInput').value.trim();

  if (!title || !post) {
    return alert('Need some more datas');
  }

  var doc = {
    _id: title.replace(' ', '-'),
    title: title,
    post: post,
    posted: Date.now()
  }

  this.db.put(doc);
};

Arandomurl.prototype.previewPostClicked = function() {

  var btn = document.getElementById('previewPost');
  var input = document.getElementById('postInput');
  var preview = document.getElementById('postPreview');

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
};

new Arandomurl();
