/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";
var port = Number(process.env.PORT || 8080);
var express = require('express');
var app = express();
var server = app.listen(port);
var io = require('socket.io')(server);
var sanitizer = require('sanitizer');
var bcrypt = require('bcrypt');
var knex = require('knex')({
  client: 'sqlite3', // database driver. mysql|pg|sqlite3
  connection: { // to connect a database server. see http://knexjs.org/#Installation-client
    filename: 'db.sqlite'
  }
});
var config = {
  tableName : "Events", // database table name.
  table : { // the table columns and type. the column 'id' and 'done' is reserved. - string|integer|boolean
    name : "string",
    ring : "integer",
    competitors : "integer",
    orderNo : "integer",
    done : "boolean"
  },
  username : "admin",
  password : bcrypt.hashSync('password', 12),
  detail : "ring", // a table column whose table is accessed with /{number}. - must be of type integer
  orderBy : "orderNo DESC, ring ASC, done DESC" //order the table by column name. - ASC|DESC
};
var http = require('http');
var https = require('https');

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine("def", require("dot-emc").init({app: app}).renderFile);
app.set("view engine", "def");
http.globalAgent.maxSockets = 1000;
https.globalAgent.maxSockets = 1000;

knex.schema.hasTable(config.tableName).then(function(exists) {
  if (!exists) {
    return knex.schema.createTable(config.tableName, function (table) {
      table.increments();
      for (var column in config.table) {
        table[config.table[column]](column); // eg. config.table[column] = string and column = name. - table.string('name');
      }
    });
  }
});

function escapeHtml(text) {
  text = sanitizer.sanitize(text);
  text = sanitizer.escape(text);
  if (!isNaN(text) && text != ''){
    text = parseFloat(text, 10);
  }
  return text
}

 // var numOfCols = Object.size(config.table);
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}
require('./routes')(app, knex, escapeHtml, config, bcrypt);
require('./socket')(io, knex, escapeHtml, config);

console.log('Listening on port: ' + port + '\nCTRL + C to shutdown');
