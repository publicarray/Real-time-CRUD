 module.exports = function (app, knex, escapeHtml, config, bcrypt) {
  "use strict";
  app.get('/', function (req, res) {
    knex.select().from(config.tableName).orderByRaw(config.orderBy).then(function(rows) {
      res.render('index', {table:rows, schema:config.table});
    }).catch(function(error) {
      console.error(error);
    });
  });

  app.get('/:id(\\d+)/', function (req, res) {
    var num = escapeHtml(req.param('id'));
    knex.select().from(config.tableName).where(config.detail, num).orderByRaw(config.orderBy).then(function(rows) {
      res.render('detail', {table:rows, detail:config.detail, schema:config.table});
    }).catch(function(error) {
      console.error(error);
    });
  });

  app.get('/admin', function (req, res) {
    if (req.query.hash) {
      var now = Math.round(new Date().getTime() / 1000);
      var user = new Buffer(req.query.hash, 'base64').toString('utf8');
      user = JSON.parse(user);
      var userTime = (parseInt(user.time));
    if (!user || user.name !== config.username || !bcrypt.compareSync(user.pass, config.password)) {
        res.render('login', {message: 'The user name or password you entered is incorrect.'});
        //time allowed to stay sign-in is 120s / time out(response time)
      } else if ((userTime+120) < now || userTime > (now+120)) {
        res.render('login', {message: 'The session has timed out.'});
      } else {
        knex.select().from(config.tableName).orderByRaw(config.orderBy).then(function(rows) {
          res.render('admin', {table:rows, schema:config.table});
        }).catch(function(error) {
          console.error(error);
        });
      }
    } else {
      res.render('login');
    }
  });

  // return table as json
  app.get('/api', function (req, res) {
    knex.select().from(config.tableName).orderByRaw(config.orderBy).then(function(rows) {
      res.json(rows);
    }).catch(function(error) {
      console.error(error);
    });
  });

  // return html friendly 404 errors
  app.use(function (req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
      res.render('404', {url: req.url});
      return;
    }
  });
}
