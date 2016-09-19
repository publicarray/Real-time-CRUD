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
'use strict';
var config = require('./config'); // get user config file
var bcrypt = require('bcrypt'); // a crypto library
var salt = bcrypt.genSaltSync(); // create salt
var cookieSession = require('cookie-session'); // cookie sessions
var bodyParser = require('body-parser'); // parse post requests
var express = require('express');
var app = express();
var server = app.listen(config.port); // start server
var io = require('socket.io')(server); // start socket.io server
var sanitizer = require('sanitizer');
var knex = require('knex')({
  client: config.client,
  connection: config.connection,
  useNullAsDefault: config.useNullAsDefault
});
var helmet = require('helmet');  // Please read https://github.com/helmetjs/helmet/blob/master/README.md
config.password = bcrypt.hashSync(config.password, salt, 12); // hash password

app.disable('x-powered-by'); // Remove default x-powered-by response header
app.use(helmet.xssFilter()); // Trying to prevent: Cross-site scripting attacks (XSS)
app.use(helmet.frameguard()); // Trying to prevent: Your page being put in a <frame> or <iframe>
app.use(helmet.noSniff()); // Don't infer the MIME type: noSniff
app.use(helmet.dnsPrefetchControl()); // Stop DNS Pre-fetching
app.use(helmet.referrerPolicy({policy: 'origin-when-cross-origin'})) // Prevent other websites from tracking visitors
// options: "no-referrer", "no-referrer-when-downgrade", "same-origin", "origin", "origin-when-cross-origin", "unsafe-url"
// see <https://www.w3.org/TR/referrer-policy/#referrer-policy-origin> for details
app.use(helmet.contentSecurityPolicy({ // Content-Security-Policy https://report-uri.io/home/generate/
  // Modify this at your discretion
  directives: {
    defaultSrc: ["'none'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:'],
    fontSrc: ["'self'"],
    connectSrc: ["'self'", 'ws:', 'wss:'],
    formAction: ["'self'"],
    reflectedXss: 'block',
    referrer: 'origin-when-cross-origin', // see above, must have the same value
    reportUri: '/report-violation' // Please change this
  },
  // Set to true if you only want browsers to report errors, not block them
  reportOnly: false
}));

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine('def', require('dot-emc').init({ app: app }).renderFile);
app.set('view engine', 'def');

knex.schema.hasTable(config.tableName).then(function createTableIfExists(exists) {
  if (!exists) {
    return knex.schema.createTable(config.tableName, function createTable(table) {
      var column;
      table.increments();
      for (column in config.table) {
        if (config.table.hasOwnProperty(column)) {
          table[config.table[column]](column); // eg. config.table[column] = string and column = name. - table.string('name');
        }
      }
    });
  }
  return null;
}).catch(function printError(error) {
  console.error(error);
});

if (config.ssl) {
  var fs = require('fs'); // read files
  var tls = require('tls');
  var net = require('net');

  // HTTP Strict Transport Security
  // app.use(helmet.hsts({
  //   maxAge: 31536000000, // aprox one year
  //   includeSubdomains: true,
  //   force: true
  // }));

  // from <https://certsimple.com/blog/a-plus-node-js-ssl>
  var sslOptions = {
    key: fs.readFileSync(config.ssl.privateKey),
    cert: fs.readFileSync(config.ssl.certificate),
    // <https://github.com/nodejs/node/blob/master/doc/api/tls.md#modifying-the-default-tls-cipher-suite>
    // <https://wiki.mozilla.org/Security/Server_Side_TLS>
    // ciphers: process.env.CIPHERS || [
    // Modern
      // 'ECDHE-ECDSA-AES256-GCM-SHA384',
      // 'ECDHE-RSA-AES256-GCM-SHA384',
      // 'ECDHE-ECDSA-CHACHA20-POLY1305',
      // 'ECDHE-RSA-CHACHA20-POLY1305',
      // 'ECDHE-ECDSA-AES128-GCM-SHA256',
      // 'ECDHE-RSA-AES128-GCM-SHA256',
      // 'ECDHE-ECDSA-AES256-SHA384',
      // 'ECDHE-RSA-AES256-SHA384',
      // 'ECDHE-ECDSA-AES128-SHA256',
      // 'ECDHE-RSA-AES128-SHA256',
    // Intermediate
      // 'ECDHE-ECDSA-CHACHA20-POLY1305'
      // 'ECDHE-RSA-CHACHA20-POLY1305'
      // 'ECDHE-ECDSA-AES128-GCM-SHA256'
      // 'ECDHE-RSA-AES128-GCM-SHA256'
      // 'ECDHE-ECDSA-AES256-GCM-SHA384'
      // 'ECDHE-RSA-AES256-GCM-SHA384'
      // 'DHE-RSA-AES128-GCM-SHA256'
      // 'DHE-RSA-AES256-GCM-SHA384'
      // 'ECDHE-ECDSA-AES128-SHA256'
      // 'ECDHE-RSA-AES128-SHA256'
      // 'ECDHE-ECDSA-AES128-SHA'
      // 'ECDHE-RSA-AES256-SHA384'
      // 'ECDHE-RSA-AES128-SHA'
      // 'ECDHE-ECDSA-AES256-SHA384'
      // 'ECDHE-ECDSA-AES256-SHA'
      // 'ECDHE-RSA-AES256-SHA'
      // 'DHE-RSA-AES128-SHA256'
      // 'DHE-RSA-AES128-SHA'
      // 'DHE-RSA-AES256-SHA256'
      // 'DHE-RSA-AES256-SHA'
      // 'ECDHE-ECDSA-DES-CBC3-SHA'
      // 'ECDHE-RSA-DES-CBC3-SHA'
      // 'EDH-RSA-DES-CBC3-SHA'
      // 'AES128-GCM-SHA256'
      // 'AES256-GCM-SHA384'
      // 'AES128-SHA256'
      // 'AES256-SHA256'
      // 'AES128-SHA'
      // 'AES256-SHA'
      // 'DES-CBC3-SHA'
      // '!DSS'
    // ].join(':'),
    honorCipherOrder: true // migrate BEAST attacks
  };

  // stunnel obtained from: <http://stackoverflow.com/questions/17285180/use-both-http-and-https-for-socket-io>
  // direct link: <http://stackoverflow.com/a/22641671>
  tls.createServer(sslOptions, function createStunnel(cleartextStream) {
    var cleartextRequest = net.connect({
      port: config.port,
      host: config.domain
    }, function openStream() {
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

function escapeHtml(text) {
  text = sanitizer.sanitize(text);
  text = sanitizer.escape(text);
  text = text.replace(/{{|}}/g, '');
  return text;
}

require('./routes')(app, urlencodedParser, knex, escapeHtml, config, bcrypt);
require('./socket')(io, knex, escapeHtml, config);

console.log('Listening on http://' + config.domain + ':' + config.port + '\nCTRL + C to shutdown');
