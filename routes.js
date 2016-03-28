module.exports = function routes(app, urlencodedParser, knex, escapeHtml, config, bcrypt) {
  'use strict';
  app.get('/', function home(req, res) {
    knex.select().from(config.tableName).orderByRaw(config.orderBy).then(function (rows) {
      res.render('index', { table: rows, schema: config.table, title: config.appTitle });
    }).catch(function printError(error) {
      console.error(error);
    });
  });

  if (config.detail) {
    app.get('/:id(\\d+)/', function (req, res) {
      var num = escapeHtml(req.params.id);
      knex.select().from(config.tableName).where(config.detail, num).orderByRaw(config.orderBy).then(function (rows) {
        res.render('detail', { table: rows, detail: config.detail, schema: config.table, title: config.appTitle });
      }).catch(function printError(error) {
        console.error(error);
      });
    });
  }

  function renderAdmin(res) {
    knex.select().from(config.tableName).orderByRaw(config.orderBy).then(function (rows) {
      res.render('admin', { table: rows, schema: config.table, signin: true, title: config.appTitle });
    }).catch(function printError(error) {
      console.error(error);
    });
  }

  app.get('/admin', function admin(req, res) {
    if (req.session.populated && req.session.username && req.session.password) {
      // Already logged in.
      if (req.query.logout) {
        req.session = null; // logout
        res.render('login', { title: config.appTitle });
      } else {
        renderAdmin(res);
      }
    } else {
      res.render('login', { title: config.appTitle });
    }
  });

  app.post('/admin', urlencodedParser, function login(req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    if (user === config.username && bcrypt.compareSync(pass, config.password)) {
      // Set the sessions.
      req.session.username = user;
      req.session.password = pass;
      renderAdmin(res);
    } else if (user || pass) {
      res.render('login', { message: 'The username or password you entered is incorrect.', title: config.appTitle });
    } else {
      res.render('login', { title: config.appTitle });
    }
  });

  // TODO API

  // return table as json
  // app.get('/api', function (req, res) {
  //   knex.select().from(config.tableName).orderByRaw(config.orderBy || "id").then(function (rows) {
  //     res.json(rows);
  //   }).catch(function (error) {
  //     console.error(error);
  //   });
  // });

  // return html friendly 404 errors
  app.use(function error404(req, res) {
    res.status(404);
    if (req.accepts('html')) {
      res.render('404', { url: req.url, title: config.appTitle });
      return;
    }
  });
};
