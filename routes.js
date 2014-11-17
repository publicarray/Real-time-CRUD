module.exports = function(app, knex, escapeHtml) {
	"use strict";
	app.get('/', function (req, res) {
    knex.select().from('Events').orderByRaw('orderNo DESC, ring ASC, done DESC').then(function(rows) {
      res.render('index', {events:rows});
    }).catch(function(error) {
      console.error(error);
    });
	});

	app.get('/:id(\\d+)/', function (req, res) {
	  var ring = escapeHtml(req.param('id'));
    knex.select().from('Events').where('ring', ring).orderByRaw('orderNo DESC, ring ASC, done DESC').then(function(rows) {
      res.render('ring', {events:rows});
    }).catch(function(error) {
      console.error(error);
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
        knex.select().from('Events').orderByRaw('orderNo DESC, ring ASC, done DESC').then(function(rows) {
          res.render('admin', {events:rows});
        }).catch(function(error) {
          console.error(error);
        });
	    }
	  } else {
	    res.render('login');
	  }
	});

  // return table as json
	app.get('/data', function (req, res) {
    knex.select().from('Events').orderByRaw('orderNo DESC, ring ASC, done DESC').then(function(rows) {
      res.json(rows);
    }).catch(function(error) {
      console.error(error);
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