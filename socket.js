module.exports = function(io, knex, escapeHtml) {
  "use strict";
  io.on('connection', function (socket) {
    socket.on('add', function (name, ring, comp, orderNo, done) {
      name = escapeHtml(name);
      ring = escapeHtml(ring);
      comp = escapeHtml(comp);
      orderNo = escapeHtml(orderNo);
      done = escapeHtml(done);
      knex('Events').insert({'name':name, 'ring':ring, 'competitors':comp, 'orderNo':orderNo, 'done':done}).then(function(rows) {
        var data = {'id':rows[0], 'name':name, 'ring':ring, 'comp':comp, 'orderNo':orderNo, 'done':done};
        io.emit('add', data);
        // console.log('Created', data);
      }).catch(function(error) {
        console.error(error);
      });
    });
    socket.on('update', function (id, name, ring, comp, orderNo, done) {
      id = escapeHtml(id);
      name = escapeHtml(name);
      ring = escapeHtml(ring);
      comp = escapeHtml(comp);
      orderNo = escapeHtml(orderNo);
      done = escapeHtml(done);
      knex('Events').where('id', id).update({'name':name, 'ring':ring, 'competitors':comp, 'orderNo':orderNo, 'done':done}).catch(function(error) {
        console.error(error);
      });
      var data = {'id':id ,'name':name, 'ring':ring, 'comp':comp, 'orderNo':orderNo, 'done':done};
      io.emit('update', data);
      // console.log('Updated', data);
    });
    socket.on('delete', function (id) {
      id = escapeHtml(id);
      knex('Events').where('id', id).del().catch(function(error) {
        console.error(error);
      });
      io.emit('delete', id);
      // console.log('Deleted', id);
    });
  });
}