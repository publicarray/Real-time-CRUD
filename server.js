/* Copyright 2014 Sebastian Schmidt
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.*/
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
    Event : "string",  // don't change these without resetting the database
    Ring : "integer",  // don't change these without resetting the database
    '# of Competitors' : "integer",  // don't change these without resetting the database
    Finished : "boolean"  // don't change these without resetting the database
  },
  username : "admin",
  password : bcrypt.hashSync('password', 12),
  detail : "Ring", // a table column whose table is accessed with /{number}. - must be of type integer
  orderBy : "Ring ASC, Finished DESC" //order the table by column name. - ASC|DESC
};
var http = require('http');
var https = require('https');

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine("def", require("dot-emc").init({app: app}).renderFile);
app.set("view engine", "def");
http.globalAgent.maxSockets = 1000;
https.globalAgent.maxSockets = 1000;

knex.schema.hasTable(config.tableName).then(function (exists) {
  if (!exists) {
    return knex.schema.createTable(config.tableName, function (table) {
      table.increments();
      for (var column in config.table) {
        table[config.table[column]](column); // eg. config.table[column] = string and column = name. - table.string('name');
      }
    });
  }
});

function escapeHtml (text) {
  text = sanitizer.sanitize(text);
  text = sanitizer.escape(text);
  if (!isNaN(text) && text != ''){
    text = parseFloat(text, 10);
  }
  return text
}

require('./routes')(app, knex, escapeHtml, config, bcrypt);
require('./socket')(io, knex, escapeHtml, config);

console.log('Listening on port: ' + port + '\nCTRL + C to shutdown');
