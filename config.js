// set config to sensible defaults - PLEASE DO NOT MODEFY
var config = {
  appTitle: 'Real-time CRUD',
  domain: process.env.HOST || 'localhost',
  client: 'sqlite3',
  connection: {
    filename: 'db.sqlite'
  },
  useNullAsDefault: true,
  tableName: 'table',
  table: {
    Name: 'string',
    age: 'integer'
  },
  orderBy: 'id',
  username: 'admin',
  password: 'password',
  port: process.env.PORT || 8080
};
// **************************************************************** //
//                     USER CONFIGURATION                           //
// **************************************************************** //

// Title
config.appTitle = 'Real-time CRUD';

// Domain the website is hosted at
// config.domain = 'mydomain.com';

// SQL Database driver
// options are: mysql|pg|sqlite3
config.client = 'sqlite3';

// Database connection
// more information see http://knexjs.org/#Installation-client
config.connection = {
  filename: 'db.sqlite'
  // host: '127.0.0.1',
  // port: 5432,
  // user: 'database_username',
  // password: 'database_password',
  // database: 'database_name'
};

// SQL Table Name
config.tableName = 'event';

// SQL Table Schema
// Column Name : Type
// The Type can be one of string|integer|boolean
// NOTE: Any change you make must be also me made to the database table manually
config.table = {
  Event: 'string',
  Ring: 'integer',
  '# of Competitors': 'integer',
  Finished: 'boolean'
};

// Username of the login
config.username = 'admin';

// Password
config.password = 'password';

// A special table column whose table is accessed with /{number}
// NOTE: must be of type integer
// config.detail = 'Ring';

// Order the table by columns
// ASC = acceding
// DESC = descending
// config.orderBy = 'Ring ASC, Finished DESC';

// Web Server Port
// config.port = 8080;

// Enable secure https
// Tutorial on how to create certificates: <http://greengeckodesign.com:8880/blog/2013/06/15/creating-an-ssl-certificate-for-node-dot-js/>
//  First install openssl: <https://www.openssl.org/>
//  Create RSA key: openssl genrsa 1024 > ssl/privatekey.pem
//  CreateSSL certificate: openssl req -new -key ssl/privatekey.pem -out ssl/csr.pem
//      openssl x509 -req -days 365 -in ssl/csr.pem -signkey ssl/privatekey.pem -out ssl/certificate.crt
// config.ssl = {
//   privateKey: 'ssl/privatekey.pem',
//   certificate: 'ssl/certificate.crt',
//   port: '8081'
// };

// **************************************************************** //
//                   END USER CONFIGURATION                         //
// **************************************************************** //
module.exports = config;
