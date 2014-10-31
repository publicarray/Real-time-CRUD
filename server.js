var port = Number(process.env.PORT || 8080);
var express = require('express');
var app = express();
var server = app.listen(port);
var io = require('socket.io')(server);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('db.sqlite');
var sanitizer = require('sanitizer');
var http = require('http');
var https = require('https');
var numUsers = 0;
app.use(express.static('public'));
app.set('views', __dirname+'/views');
app.engine("def", require("dot-emc").init({app: app}).renderFile);
app.set("view engine", "def");
http.globalAgent.maxSockets = 1000;
https.globalAgent.maxSockets = 1000;
// db.run("DROP TABLE Events");
db.run("CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, ring INTEGER, competitors INTEGER, done BOOLEAN);");

app.get('/', function (req, res) {
  db.all("SELECT * FROM Events ORDER BY ring ASC, done DESC", function (err, row) {
    if (err) {
      console.err(err);
    } else {
      res.render('index', {events:row, users:numUsers});
    }
  });
});

app.get('/:id(\\d+)/', function (req, res) {
  var ring = escapeHtml(req.param('id'));
  db.all("SELECT * FROM Events WHERE ring = ? ORDER BY ring ASC, done DESC", [ring], function (err, row) {
    if (err) {
      console.err(err);
    } else {
      res.render('ring', {events:row, users:numUsers});
    }
  });
});

app.get('/admin', function (req, res) {
  if (req.query.hash) {
    var now = Math.round(new Date().getTime() / 1000);
    var user = new Buffer(req.query.hash, 'base64').toString('utf8');
    user = JSON.parse(escapeHtml(user));
    var userTime = (parseInt(user.time));
    if (!user || user.name !== 'karate' || user.pass !== 'cma') {
      res.render('login', {message: 'The user name or password you entered is incorrect.', users:numUsers});
      //time allowed to stay loged is 120s / time out(response time)
    } else if ((userTime+120) < now || userTime > (now+120)) {
      res.render('login', {message: 'The session has timed out.', users:numUsers});
    } else {
      db.all("SELECT * FROM Events ORDER BY ring ASC, done DESC", function (err, row) {
        if (err) {
          console.err(err);
        } else {
          res.render('admin', {events: row, users:numUsers});
        }
      });
    }
  } else {
    res.render('login', {users:numUsers});
  }
});

app.get('/events/:id(CS|EF|EW|PS|SC|SD|SS|SU|TF|TR|TW)', function (req, res) {
  var id = escapeHtml(req.param('id'));
  res.render('events/'+id, {users:numUsers});
});

app.get('/data', function (req, res) {
  db.all("SELECT * FROM Events ORDER BY ring ASC, done DESC", function (err, row) {
    if (err) {
      console.err(err);
    } else {
      res.json(row);
    }
  });
});

io.on('connection', function (socket) {
  socket.on('add', function (name, ring, comp, done) {
    name = escapeHtml(name);
    ring = escapeHtml(ring);
    comp = escapeHtml(comp);
    done = escapeHtml(done);
    db.run("INSERT INTO Events VALUES (null, ?, ?, ?, ?)", [name, ring, comp, done], function (err, row) {
      if (err) {
        console.err(err);
      } else {
        var data = {'id':this.lastID ,'name':name, 'ring':ring, 'comp':comp, 'done':done};
        io.emit('add', data);
        console.log('Created', data);
      }
    });
  });
  socket.on('update', function (id, name, ring, comp, done) {
    id = escapeHtml(id);
    name = escapeHtml(name);
    ring = escapeHtml(ring);
    comp = escapeHtml(comp);
    done = escapeHtml(done);
    var data = {'id':id ,'name':name, 'ring':ring, 'comp':comp, 'done':done};
    db.run("UPDATE Events SET name = ?, ring = ?, competitors=?, done = ? WHERE id = ?", [name, ring, comp, done, id], function (err, row) {
      if (err) {
        console.err(err);
      } else {
        console.log('Updated', data);
      }
    });
    io.emit('update', data);
  });
  socket.on('delete', function (id) {
    id = escapeHtml(id);
    db.run("DELETE FROM Events WHERE id = ?", [id], function (err, row) {
      if (err) {
        console.err(err);
      } else {
        console.log('Deleted', id);
      }
    io.emit('delete', id);
    });
  });
  socket.on('updateUsers', function (num) {
    numUsers = parseInt(num);
  });
});

function escapeHtml(text) {
  if (text) {
    text = text.toString();
    text = sanitizer.sanitize(text); //escape or sanitize
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

// return friendly 404 errors
app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', {url: req.url});
    return;
  }
});
console.log('Listening on port: ' + port + '\nCTRL + C to shutdown');
