'use strict';

var fs = require('fs');
var path = require('path');

var jsdom = require('jsdom').jsdom;
var express = require('express');
var bodyParser = require('body-parser');
var mkdirp = require('mkdirp');
var debug = require('debug')('arandomurl');

global.Promise = require('bluebird');

var render = require('../render.js');
var config = require('../config.js');

var DATA_DIR = './data/';
mkdirp.sync(DATA_DIR);

var PouchDB = require('pouchdb').defaults({
  prefix: DATA_DIR
});
PouchDB.plugin(require('pouchdb-find'));

var db = new PouchDB('blog');

var ROOT = path.resolve(__dirname, '../../public');

var app = express();
app.use(bodyParser.json());

// Database requests need to pass a valid auth token
app.use('/db', function(req, res, next) {
  if (req.method === 'GET' ||
      req.get('X-Auth-Token') === process.env.TOKEN) {
    return next();
  }
  res.status(401).send({error: true, reason: 'unauthorised'});
});

// If we passed the auth check, then forward requests under /db
// to PouchDB
app.use('/db', require('pouchdb-express-router')(PouchDB));

// Serve static files
app.use(express.static(ROOT, {index: null}));

app.use(function(req, res, next) {
  // Each request has a global document in scope (similiar to if it was
  // running in the browser)
  var markup = fs.readFileSync(ROOT + '/index.html');
  global.document = jsdom(markup);

  // Fake some app context, should eventually share code from the browser
  req.ctx = {
    params: req.params,
    app: {db: db}
  };

  next();
});

app.get('/', render('#content', require('../views/home.js')));
app.get('/archive/', render('#content', require('../views/archives.js')));
app.get('/post/:id', render('#content', require('../views/view-post.js')));

app.use(function(req, res, next) {
  if (req.handled) {
    res.send(global.document.documentElement.outerHTML);
  } else {
    next();
  }
});

exports.init = function(cb) {
  var server = app.listen(config.PORT, function() {
    if (cb) {
      cb(server);
    }
  });
};

if (require.main === module) {
  exports.init();
}
