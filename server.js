"use strict";
var port = Number(process.env.PORT || 8080);
var express = require('express');
var app = express();
var server = app.listen(port);
var io = require('socket.io')(server);
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: 'db.sqlite'
  }
});
var sanitizer = require('sanitizer');
var http = require('http');
var https = require('https');

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine("def", require("dot-emc").init({app: app}).renderFile);
app.set("view engine", "def");
http.globalAgent.maxSockets = 1000;
https.globalAgent.maxSockets = 1000;

knex.schema.createTable('Events', function (table) {
  table.increments();
  table.string('name');
  table.integer('ring');
  table.integer('competitors');
  table.boolean('done');
  table.integer('orderNo');
})

function escapeHtml(text) {
  if (text) {
    text = text.toString();
    text = sanitizer.sanitize(text); //escape or sanitize
    if (!isNaN(text)){
      text = parseInt(text);
      if (text<0) {
        text = 0;
      }
    }
    return text
  } else {
    return 0;
  }
}

require('./routes')(app, knex, escapeHtml);
require('./socket')(io, knex, escapeHtml);

console.log('Listening on port: ' + port + '\nCTRL + C to shutdown');
