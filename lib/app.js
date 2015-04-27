'use strict';

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

var page = require('page');

var render = require('./render.js');

function App() {

  var remoteUrl = 'http://' + document.location.host + '/db/blog/';

  this.db = new PouchDB('arandomurl');

  if (!localStorage.token) {
    this.db.replicate.from(remoteUrl);
  } else {

    document.body.dataset.admin = 'true';

    this.remote = new PouchDB(remoteUrl, {
      ajax: {headers: {'X-Auth-Token': localStorage.token}}
    });

    // Sync all the data
    var sync = this.db.sync(this.remote, {live: true, retry: true});

    sync.on('change', function(change) {
      console.log('CHANGE', change);
    });
  }
};

var app = new App();
var firstRender = true;

page(function(ctx, next) {

  // Global app object
  ctx.app = app;
  ctx.document = document;

  // Dont handle the first page load as it will have
  // happened on the server
  if (firstRender) {
    firstRender = false;
  } else {
    next();
  }
});

page('/', render('#content', require('./views/home.js')));
page('/create/', render('#content', require('./views/post.js')));
page('/edit/:id', render('#content', require('./views/post.js')));
page('/post/:id', render('#content', require('./views/view-post.js')));
page('/archive/', render('#content', require('./views/archives.js')));

page();
