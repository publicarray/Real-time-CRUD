Easy to configure, Real-time CRUD Database Web Application
===
[![Dependencies](https://david-dm.org/publicarray/Real-time-CRUD.svg)](https://david-dm.org/publicarray/Real-time-CRUD)
[![Code Climate](https://codeclimate.com/github/publicarray/Real-time-CRUD/badges/gpa.svg)](https://codeclimate.com/github/publicarray/Real-time-CRUD)

A real-time database web application build on node.js, express, socket.io and knex.js

##Installation
Install dependencies:

````bash
$ npm install
````

##How to use
Start the server:

````bash
$ node server
````

The default port is 8080.

## Configuration
All of the User configuration is done via the `config.js` file.
Explanations are in the file

## URLs
`/` displays the database table.

`/admin` allows to add, delete and updates of data.

`/{number}` is a list of the events for that {number} ring. (optional)

### Default Login Details

username is `admin`

password is `password`


## Dependencies
* [bcrypt](https://www.npmjs.org/package/bcrypt)
* [dot-emc](https://www.npmjs.org/package/dot-emc)
* [express](https://www.npmjs.org/package/express)
* [knex](https://www.npmjs.org/package/knex)
* [sanitizer](https://www.npmjs.org/package/sanitizer)
* [socket.io](https://www.npmjs.org/package/socket.io)

#### Database specific Dependencies/Drivers
* [mysql](https://www.npmjs.org/package/mysql)
* [pg](https://www.npmjs.org/package/pg)
* [sqlite3](https://www.npmjs.org/package/sqlite3)
* [more...](http://knexjs.org/#Installation-node)

Note: mysql, pg and sqlite3 are all installed by default.

## License
Copyright 2014 Sebastian Schmidt

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
