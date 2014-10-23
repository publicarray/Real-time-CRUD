var express = require('express');
var app = express();
var server = app.listen(8080);
var io = require('socket.io')(server);
var jade = require('jade');
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('db.sqlite');

app.use(express.static('public'));
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');

db.serialize(function () {
  // db.run("DROP TABLE Events");
  db.run("CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, ring INTEGER, done BOOLEAN);");
  // db.run("INSERT INTO Events VALUES (null, 'kickboxing', 1, 0)");
  // db.close();
});

app.get('/', function (req, res) {
  db.all("SELECT * FROM Events ORDER BY ring ASC, done DESC", function (err, row) {
    res.render('index', {events:row});
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
  socket.on('add', function (name, ring, done) {
    var name = escapeHtml(name);
    var ring = parseInt(ring);
    var done = escapeHtml(done);
    db.run("INSERT INTO Events VALUES (null, ?, ?, ?)", [name, ring, done], function (err, row) {
      if (err === null) {
        var data = [{'id':this.lastID ,'name':name, 'ring':ring, 'done':done}];
        io.emit('add', data);
      }
    });
  });
  socket.on('update', function (id, name, ring, done) {
    var id = parseInt(id);
    var name = escapeHtml(name);
    var ring = parseInt(ring);
    var done = escapeHtml(done);
    db.run("UPDATE Events SET name = ?, ring = ?, done = ? WHERE id = ?", [name, ring, done, id], function (err, row) {
      if (err === null) {
        var data = [{'id':id ,'name':name, 'ring':ring, 'done':done}];
        io.emit('update', data);
      }
    });
  });
});

function escapeHtml(text) {
  if (text) {
    text = text.toString();
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
  } else {
    return 0;
  }
}
