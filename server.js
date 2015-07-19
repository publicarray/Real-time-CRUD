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
var config = require('./config'); // get user config file
var bcrypt = require('bcrypt'); // a crypto library
var cookieSession = require('cookie-session'); // cookie sessions
var bodyParser = require('body-parser'); // parse post requests
config.password = bcrypt.hashSync(config.password, 12); // hash password
var express = require('express');
var app = express();
var server = app.listen(config.port);
var io = require('socket.io')(server);
var sanitizer = require('sanitizer');
var knex = require('knex')({
  client: config.client,
  connection: config.connection
});
app.disable('x-powered-by');
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine("def", require("dot-emc").init({app: app}).renderFile);
app.set("view engine", "def");

knex.schema.hasTable(config.tableName).then(function (exists) {
  if (!exists) {
    return knex.schema.createTable(config.tableName, function (table) {
      table.increments();
      for (var column in config.table) {
        if (config.table.hasOwnProperty(column)) {
          table[config.table[column]](column); // eg. config.table[column] = string and column = name. - table.string('name');
        }
      }
    });
  }
}).catch(function(error) {
  console.error(error);
});

// app.set('trust proxy', 1); // trust first proxy
app.use(cookieSession({
  name: 'session',
  keys: ['username', 'password'],
  domain: config.domain
}));

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false,
  limit: 1024,
  type: 'application/x-www-form-urlencoded'
});

function escapeHtml (text) {
  text = sanitizer.sanitize(text);
  text = sanitizer.escape(text);
  text = text.replace(/{{|}}/g, '');
  return text;
}

require('./routes')(app, urlencodedParser, knex, escapeHtml, config, bcrypt);
require('./socket')(io, knex, escapeHtml, config);

console.log('Listening on port: ' + config.port + '\nCTRL + C to shutdown');
