"use strict";
var port = Number(process.env.PORT || 8080);
var express = require('express');
var app = express();
var server = app.listen(port);
var io = require('socket.io')(server);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('db.sqlite');
var sanitizer = require('sanitizer');
var http = require('http');
var https = require('https');

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine("def", require("dot-emc").init({app: app}).renderFile);
app.set("view engine", "def");
http.globalAgent.maxSockets = 1000;
https.globalAgent.maxSockets = 1000;
db.run("CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, ring INTEGER, competitors INTEGER, done BOOLEAN, orderNo INTEGER);");

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

require('./routes')(app, db, escapeHtml);
require('./socket')(io, db, escapeHtml);

console.log('Listening on port: ' + port + '\nCTRL + C to shutdown');
