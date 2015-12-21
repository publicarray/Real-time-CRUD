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
var salt = bcrypt.genSaltSync(); // create salt
config.password = bcrypt.hashSync(config.password, salt, 12); // hash password
var cookieSession = require('cookie-session'); // cookie sessions
var bodyParser = require('body-parser'); // parse post requests
var express = require('express');
var app = express();
var server = app.listen(config.port); // start server
var io = require('socket.io')(server); // start socket.io server
var sanitizer = require('sanitizer');
var knex = require('knex')({
  client: config.client,
  connection: config.connection
});
var helmet = require('helmet');  // Please read https://github.com/helmetjs/helmet/blob/master/README.md
app.disable('x-powered-by'); // Remove default x-powered-by response header
app.use(helmet.xssFilter()); // Trying to prevent: Cross-site scripting attacks (XSS)
app.use(helmet.frameguard()); // Trying to prevent: Your page being put in a <frame> or <iframe>
app.use(helmet.noSniff()); // Don't infer the MIME type: noSniff
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

if (config.ssl) {
  var fs = require('fs'); // read files
  var tls = require('tls');
  var net = require('net');

  // from <https://certsimple.com/blog/a-plus-node-js-ssl>
  var sslOptions = {
    key: fs.readFileSync(config.ssl.privateKey),
    cert: fs.readFileSync(config.ssl.certificate),
    // fix forward secrecy by using ciphers from the iojs docs
    // <https://github.com/nodejs/io.js/blob/master/doc/api/tls.markdown#tlscreateserveroptions-secureconnectionlistener>
    ciphers: process.env.CIPHERS || [
      "ECDHE-RSA-AES128-GCM-SHA256",
      "ECDHE-ECDSA-AES128-GCM-SHA256",
      "ECDHE-RSA-AES256-GCM-SHA384",
      "ECDHE-ECDSA-AES256-GCM-SHA384",
      "DHE-RSA-AES128-GCM-SHA256",
      "ECDHE-RSA-AES128-SHA256",
      "DHE-RSA-AES128-SHA256",
      "ECDHE-RSA-AES256-SHA384",
      "DHE-RSA-AES256-SHA384",
      "ECDHE-RSA-AES256-SHA256",
      "DHE-RSA-AES256-SHA256",
      "HIGH",
      "!aNULL",
      "!eNULL",
      "!EXPORT",
      "!DES",
      "!RC4", // disable weak cipher
      "!MD5",
      "!PSK",
      "!SRP",
      "!CAMELLIA"
    ].join(':'),
    honorCipherOrder: true // migrate BEAST attacks
  };

  // stunnel obtained from: <http://stackoverflow.com/questions/17285180/use-both-http-and-https-for-socket-io>
  tls.createServer(sslOptions, function (cleartextStream) {
    var cleartextRequest = net.connect({
        port: config.port,
        host: config.domain
    }, function () {
        cleartextStream.pipe(cleartextRequest);
        cleartextRequest.pipe(cleartextStream);
    });
  }).listen(config.ssl.port);

  console.log('TSL/SSL [ON]\nListening on https://' + config.domain + ':' + config.ssl.port);
}

// app.set('trust proxy', 1); // trust first proxy
app.use(cookieSession({
  name: 'sessionId',
  keys: ['username', 'password'],
  cookie: {
    domain: config.domain,
    httpOnly: true,
    // secure: true, // need https
    signed: true
  }
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

console.log('Listening on http://' + config.domain + ':' + config.port +'\nCTRL + C to shutdown');
