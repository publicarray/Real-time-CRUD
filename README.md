Real-Time RESTfull Database Web Application
===
[![Dependencies](https://david-dm.org/publicarray/CMA.png)](https://david-dm.org/publicarray/CMA)

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

## License
Copyright (C) 2014 Sebastian Schmidt
Distributed under the GNU GPL v3.0 License
