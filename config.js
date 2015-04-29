var config = {};
//*****************************************************************//
//                     USER CONFIGURATION                          //
//*****************************************************************//

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
config.tableName = "Events";

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
// config.detail = "Ring"

// Order the table by columns
// ASC = acceding
// DESC = descending
// config.orderBy = "Ring ASC, Finished DESC"

//*****************************************************************//
//                    END USER CONFIGURATION                       //
//*****************************************************************//
module.exports = config;
