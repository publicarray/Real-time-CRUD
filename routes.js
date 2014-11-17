module.exports = function(app, db, escapeHtml) {
	"use strict";
	app.get('/', function (req, res) {
	  db.all("SELECT * FROM Events ORDER BY orderNo DESC, ring ASC, done DESC", function (err, row) {
	    if (err) {
	      console.err(err);
	    } else {
	      res.render('index', {events:row});
	    }
	  });
	});

	app.get('/:id(\\d+)/', function (req, res) {
	  var ring = escapeHtml(req.param('id'));
	  db.all("SELECT * FROM Events WHERE ring = ? ORDER BY orderNo DESC, ring ASC, done DESC", [ring], function (err, row) {
	    if (err) {
	      console.err(err);
	    } else {
	      res.render('ring', {events:row});
	    }
	  });
	});

	app.get('/admin', function (req, res) {
	  if (req.query.hash) {
	    var now = Math.round(new Date().getTime() / 1000);
	    var user = new Buffer(req.query.hash, 'base64').toString('utf8');
	    user = JSON.parse(escapeHtml(user));
	    var userTime = (parseInt(user.time));
	    if (!user || user.name !== 'admin' || user.pass !== 'password') {
	      res.render('login', {message: 'The user name or password you entered is incorrect.'});
	      //time allowed to stay sign-in is 120s / time out(response time)
	    } else if ((userTime+120) < now || userTime > (now+120)) {
	      res.render('login', {message: 'The session has timed out.'});
	    } else {
	      db.all("SELECT * FROM Events ORDER BY orderNo DESC, ring ASC, done DESC", function (err, row) {
	        if (err) {
	          console.err(err);
	        } else {
	          res.render('admin', {events:row});
	        }
	      });
	    }
	  } else {
	    res.render('login');
	  }
	});

  // return table as json
	app.get('/data', function (req, res) {
	  db.all("SELECT * FROM Events ORDER BY orderNo DESC, ring ASC, done DESC", function (err, row) {
	    if (err) {
	      console.err(err);
	    } else {
	      res.json(row);
	    }
	  });
	});

	// return friendly 404 errors
	app.use(function(req, res, next){
	  res.status(404);
	  if (req.accepts('html')) {
	    res.render('404', {url: req.url});
	    return;
	  }
	});
}