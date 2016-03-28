# Easy to configure, Real-time CRUD Database Web Application
[![Dependency Status](https://gemnasium.com/publicarray/Real-time-CRUD.svg)](https://gemnasium.com/publicarray/Real-time-CRUD)
[![Dependencies](https://david-dm.org/publicarray/Real-time-CRUD.svg)](https://david-dm.org/publicarray/Real-time-CRUD)
[![Code Climate](https://codeclimate.com/github/publicarray/Real-time-CRUD/badges/gpa.svg)](https://codeclimate.com/github/publicarray/Real-time-CRUD)

A real-time database web application build on node.js, express, socket.io and knex.js

* [Installation](#installation)
  * [ Start the server](#start-the-server)
  * [Configuration](#configuration)
  * [URLs](#urls)
    * [Default Login Details](#default-login-details)
  * [How to Create a self signed certificate](#how-to-create-a-self-signed-certificate)
* [Dependencies](#dependencies)
  * [Database specific Dependencies/Drivers](#database-specific-dependenciesdrivers)
* [License](#license)

## Installation
Install [dependencies](#dependencies):

```bash
$ npm install --production
```

### Start the server

```bash
$ node server
```

The default port is 8080.

### Configuration
All of the User configuration is done via the `config.js` file. Explanations are in the file

### URLs
`/` displays the database table.

`/admin` allows to add, delete and updates of data.

`/{number}` is a list of the events for that {number} ring. (optional)

#### Default Login Details
username is `admin`

password is `password`

### How to Create a certificate (used for https)

Information on certificate creation can he found here: https://www.feistyduck.com/library/openssl-cookbook/online/ch-openssl.html

#### Self-signed certificate

**Note: do not use in production!**

First install [openssl](https://www.openssl.org/)

Than create a new folder: `mkdir ssl`

Create a RSA key:

```
openssl genrsa 2048 > ssl/privatekey.pem
```

Create the SSL certificate:

```
openssl req -new -key ssl/privatekey.pem -out ssl/csr.pem
openssl x509 -req -days 365 -in ssl/csr.pem -signkey ssl/privatekey.pem -out ssl/certificate.crt
```

## Dependencies
- [bcrypt](https://www.npmjs.org/package/bcrypt)
- [dot-emc](https://www.npmjs.org/package/dot-emc)
- [express](https://www.npmjs.org/package/express)
- [knex](https://www.npmjs.org/package/knex)
- [sanitizer](https://www.npmjs.org/package/sanitizer)
- [socket.io](https://www.npmjs.org/package/socket.io)

### Database specific Dependencies/Drivers
- [mysql](https://www.npmjs.org/package/mysql)
- [pg](https://www.npmjs.org/package/pg)
- [sqlite3](https://www.npmjs.org/package/sqlite3)
- [more...](http://knexjs.org/#Installation-node)

Note: mysql, pg and sqlite3 are all installed by default.

## Update Bower Dependencies (Optional)

To update dependencies from bower:
```
npm install
bower install
gulp
```

Minified versions of bower dependencies are included in `public/lib`. These may be out of date but it allows users to get up and running faster.

## License
Copyright 2014 Sebastian Schmidt

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
