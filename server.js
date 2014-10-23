var express = require('express');
var app = express();
var server = app.listen(8080);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('db.sqlite');
var io = require('socket.io').listen(server);

app.use(express.static('public'));

db.serialize(function () {
  // db.run("DROP TABLE Events");
  db.run("CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, ring INTEGER, done BOOLEAN);");
  // db.run("INSERT INTO Events VALUES (null, 'kickboxing', 1, 0)");
  // db.close();
});

app.get('/', function (req, res) {
  // db.all("SELECT * FROM Events", function (err, row) {
  //   console.log(row);
  // });
  res.sendFile('public/index.html', {root: __dirname});
});

app.get('/admin', function (req, res) {
  // db.all("SELECT * FROM Events", function (err, row) {
  //   console.log(row);
  // });
  res.sendFile('public/admin.html', {root: __dirname});
});

app.get('/data', function (req, res) {
  db.all("SELECT * FROM Events", function (err, row) {
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
  text = text.toString();
  if (text === undefined) {
    return 0;
  } else if (text === 'On') {
    return 1;
  } else {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
  }
}
