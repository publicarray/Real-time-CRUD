module.exports = function(io, db, escapeHtml) {
  "use strict";
  io.on('connection', function (socket) {
    socket.on('add', function (name, ring, comp, orderNo, done) {
      name = escapeHtml(name);
      ring = escapeHtml(ring);
      comp = escapeHtml(comp);
      orderNo = escapeHtml(orderNo);
      done = escapeHtml(done);
      db.run("INSERT INTO Events VALUES (null, ?, ?, ?, ?, ?)", [name, ring, comp, orderNo, done], function (err, row) {
        if (err) {
          console.err(err);
        } else {
          var data = {'id':this.lastID, 'name':name, 'ring':ring, 'comp':comp, 'orderNo':orderNo, 'done':done};
          io.emit('add', data);
          // console.log('Created', data);
        }
      });
    });
    socket.on('update', function (id, name, ring, comp, orderNo, done) {
      id = escapeHtml(id);
      name = escapeHtml(name);
      ring = escapeHtml(ring);
      comp = escapeHtml(comp);
      orderNo = escapeHtml(orderNo);
      done = escapeHtml(done);
      db.run("UPDATE Events SET name = ?, ring = ?, competitors = ?, orderNo = ?, done = ? WHERE id = ?", [name, ring, comp, orderNo, done, id], function (err, row) {
        if (err) {
          console.err(err);
        } else {
          // console.log('Updated', data);
        }
      });
      var data = {'id':id ,'name':name, 'ring':ring, 'comp':comp, 'orderNo':orderNo, 'done':done};
      io.emit('update', data);
    });
    socket.on('delete', function (id) {
      id = escapeHtml(id);
      db.run("DELETE FROM Events WHERE id = ?", [id], function (err, row) {
        if (err) {
          console.err(err);
        } else {
          // console.log('Deleted', id);
        }
      io.emit('delete', id);
      });
    });
  });
}