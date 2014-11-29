Real-Time RESTfull Database Web Application
===
[![Dependencies](https://david-dm.org/publicarray/RESTfull-sockets.png)](https://david-dm.org/publicarray/RESTfull-sockets)

A real-time database web application build on node.js, express, sockets.io and SQLite

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

## URLs
`/` is the full database list

`/admin` allows adding, removing and updating data

`/{number}` is a list of the events for that {number} ring

### Login Details

username is `admin`

password is `password`


## Dependencies
* [bcrypt](https://www.npmjs.org/package/bcrypt)
* [dot-emc](https://www.npmjs.org/package/dot-emc)
* [express](https://www.npmjs.org/package/express)
* [knex](https://www.npmjs.org/package/knex)
* [sanitizer](https://www.npmjs.org/package/sanitizer)
* [socket.io](https://www.npmjs.org/package/socket.io)

#### Database specific Dependencies - all are installed by default
* [mysql](https://www.npmjs.org/package/mysql)
* [pg](https://www.npmjs.org/package/pg)
* [sqlite3](https://www.npmjs.org/package/sqlite3)


## License
Copyleft 2014 Sebastian Schmidt
Distributed under the Mozilla Public License, version 2.0
