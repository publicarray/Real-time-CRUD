var express = require('express')
var app = express();
var server = app.listen(8080)
var bodyParser = require('body-parser');
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('db.sqlite');
var io = require('socket.io').listen(server);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

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

app.post('/update', function (req, res) {
  db.run("UPDATE Events SET name = ?, ring = ?, done = ? WHERE id = ?", [escapeHtml(req.body['update_name']), parseInt(req.body['update_ring']), escapeHtml(req.body['update_done']), parseInt(req.body['update_id'])], function (err, row) {
    if (err) {
      console.err(err);
      res.status(500);
    }
    else {
      res.status(202);
    }
    res.end();
  });
});

io.on('connection', function (socket) {
  socket.on('add', function (name, ring, done) {
    name = escapeHtml(name);
    ring = parseInt(ring);
    done = escapeHtml(done);
    db.run("INSERT INTO Events VALUES (null, ?, ?, ?)", [name, ring, done], function (err, row) {
      if (err === null) {
        var data = [{'id':this.lastID ,'name':name, 'ring':ring, 'done':done}];
        io.emit('add', data);
      }
    });
  });
});

function escapeHtml(text) {
  if (text === undefined) {
    return 0;
  } else if (text === 'on') {
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
