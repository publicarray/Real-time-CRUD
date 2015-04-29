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
/* jslint node: true */
"use strict";
var port = Number(process.env.PORT || 8080);
var express = require('express');
var app = express();
var server = app.listen(port);
var io = require('socket.io')(server);
var sanitizer = require('sanitizer');
var bcrypt = require('bcrypt'); // crypto library
var config = {orderBy : "id"};

//*****************************************************************//
//                     USER CONFIGURATION                          //
//*****************************************************************//
//
// Title
config.appTitle = "RESTfull sockets";

// SQL Database driver
// options are: mysql|pg|sqlite3
config.client = "sqlite3";

// Database connection
// more information see http://knexjs.org/#Installation-client
config.connection = {
  filename : "db.sqlite"
  // host     : '127.0.0.1',
  // user     : 'your_database_user',
  // password : 'your_database_password',
  // database : 'my_database_name'
};

// SQL Table Name
// NOTE: If you change it you need to delete the "db.sqlite" file to reset the database
config.tableName = "Events";

// SQL Table Schema
// Column Name : Type
// The Type can be one of string|integer|boolean
// NOTE: If you change it you need to delete the "db.sqlite" file to reset the database
config.table = {
  Event : "string",
  Ring : "integer",
  '# of Competitors' : "integer",
  Finished : "boolean"
};

// Username of the login
config.username = "admin";

// Password
config.password = bcrypt.hashSync('password', 12);

// A special table column whose table is accessed with /{number}
// NOTE: must be of type integer
// config.detail = "Ring"

// Order the table by columns
// ASC = acceding
// DESC = descending
// config.orderBy = "Ring ASC, Finished DESC"

//*****************************************************************//
//                    END USER CONFIGURATION                       //
//*****************************************************************//
var knex = require('knex')({
  client: config.client,
  connection: config.connection
});
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine("def", require("dot-emc").init({app: app}).renderFile);
app.set("view engine", "def");

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
  if (!isNaN(text) && text !== ''){
    text = parseFloat(text, 10);
  }
  return text;
}

require('./routes')(app, knex, escapeHtml, config, bcrypt);
require('./socket')(io, knex, escapeHtml, config);

console.log('Listening on port: ' + port + '\nCTRL + C to shutdown');
