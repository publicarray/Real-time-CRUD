// set config to sensible defaults - PLEASE DO NOT MODEFY
var config = {
  appTitle: 'Real-time CRUD',
  client: 'sqlite3',
  connection: {
    filename : 'db.sqlite'
  },
  tableName: 'Table',
  table: {
    Name: 'string',
    age: 'integer'
  },
  orderBy: 'id',
  username: 'admin',
  password:'password',
  port: process.env.PORT || 8080
};
//*****************************************************************//
//                     USER CONFIGURATION                          //
//*****************************************************************//

// Title
config.appTitle = "Real-time CRUD";

// SQL Database driver
// options are: mysql|pg|sqlite3
config.client = "sqlite3";

// Database connection
// more information see http://knexjs.org/#Installation-client
config.connection = {
  filename : "db.sqlite"
  // host     : '127.0.0.1',
  // port     :  5432,
  // user     : 'your_database_user',
  // password : 'your_database_password',
  // database : 'my_database_name'
};

// SQL Table Name
config.tableName = "event";

// SQL Table Schema
// Column Name : Type
// The Type can be one of string|integer|boolean
// NOTE: If you change it you need to reset the table manually
config.table = {
  Event : "string",
  Ring : "integer",
  '# of Competitors' : "integer",
  Finished : "boolean"
};

// Username of the login
config.username = "admin";

// Password
config.password = "password";

// A special table column whose table is accessed with /{number}
// NOTE: must be of type integer
// config.detail = "Ring";

// Order the table by columns
// ASC = acceding
// DESC = descending
// config.orderBy = "Ring ASC, Finished DESC";

// Web Server Port
config.port = 8080;

//*****************************************************************//
//                    END USER CONFIGURATION                       //
//*****************************************************************//
module.exports = config;
