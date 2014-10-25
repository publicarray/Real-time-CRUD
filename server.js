// Copyright Sebastian Schmidt
require('newrelic');
var port = Number(process.env.PORT || 5000);
var express = require('express');
var app = express();
var server = app.listen(port);
console.log("Listening on port: " + port);
var io = require('socket.io')(server);
var jade = require('jade');
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('db.sqlite');
var sanitizer = require('sanitizer');

app.use(express.static('public'));
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');

db.serialize(function () {
  // db.run("DROP TABLE Events");
  db.run("CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, ring INTEGER, competitors INTEGER, done BOOLEAN);");
});
//TO DO
//split table to rings
//add reset btn
app.get('/', function (req, res) {
  db.all("SELECT * FROM Events ORDER BY ring ASC, done DESC", function (err, row) {
    res.render('index', {events:row});
  });
});

app.get('/:id(\\d+)/', function (req, res) {
  var ring = escapeHtml(req.param('id'));
  db.all("SELECT * FROM Events WHERE ring = ? ORDER BY ring ASC, done DESC", [ring], function (err, row) {
    res.render('ring', {events:row});
  });
});

app.get('/admin', function (req, res) {
  db.all("SELECT * FROM Events ORDER BY ring ASC, done DESC", function (err, row) {
    res.render('admin', {events:row});
  });
});

app.get('/data', function (req, res) {
  db.all("SELECT * FROM Events ORDER BY ring ASC, done DESC", function (err, row) {
    res.json(row);
  });
});

io.on('connection', function (socket) {
  socket.on('add', function (name, ring, comp, done) {
    name = escapeHtml(name);
    ring = escapeHtml(ring);
    comp = escapeHtml(comp);
    done = escapeHtml(done);
    db.run("INSERT INTO Events VALUES (null, ?, ?, ?, ?)", [name, ring, comp, done], function (err, row) {
      if (err === null) {
        var data = {'id':this.lastID ,'name':name, 'ring':ring, 'comp':comp, 'done':done};
        io.emit('add', data);
        console.log(this.lastID +' '+ name + ' '+ ring + ' '+ comp + ' Created');
      } else {
        console.err(err);
      }
    });
  });
  socket.on('update', function (id, name, ring, comp, done) {
    id = escapeHtml(id);
    name = escapeHtml(name);
    ring = escapeHtml(ring);
    comp = escapeHtml(comp);
    done = escapeHtml(done);
    db.run("UPDATE Events SET name = ?, ring = ?, competitors=?, done = ? WHERE id = ?", [name, ring, comp, done, id], function (err, row) {
      if (err === null) {
        var data = {'id':id ,'name':name, 'ring':ring, 'comp':comp, 'done':done};
        io.emit('update', data);
        console.log(id +' '+ name + ' '+ ring + ' '+ comp + ' Updated');
      }
    });
  });
  socket.on('delete', function (id) {
    id = parseInt(id);
    db.run("DELETE FROM Events WHERE id = ?", [id], function (err, row) {
      if (err === null) {
        io.emit('delete', id);
        console.log(id + ' Deleted');
      } else {
        console.err(err);
      }
    });
  });
});

function escapeHtml(text) {
  if (text) {
    text = text.toString();
    text = sanitizer.sanitize(text);
    if (!isNaN(text)){
      text = parseInt(text);
      if (text<0) {
        text = 0;
      }
    }
    return text
  } else {
    return 0;
  }
}
