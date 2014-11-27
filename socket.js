/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
module.exports = function(io, knex, escapeHtml, config) {
  "use strict";
  io.on('connection', function (socket) {
    socket.on('add', function () {
      var object = {};
      var colNo = 0;
      for (var column in config.table) {
        object[column] = escapeHtml(arguments[colNo]);
        colNo++;
      }
      knex(config.tableName).insert(object).then(function(rows) {
        object['id'] = rows[0];
        io.emit('add', object);
        // console.log('Created', object);
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
      knex(config.tableName).where('id', id).update({'name':name, 'ring':ring, 'competitors':comp, 'orderNo':orderNo, 'done':done}).catch(function(error) {
        console.error(error);
      });
      var data = {'id':id ,'name':name, 'ring':ring, 'comp':comp, 'orderNo':orderNo, 'done':done};
      io.emit('update', data);
      // console.log('Updated', data);
    });
    socket.on('delete', function (id) {
      id = escapeHtml(id);
      knex(config.tableName).where('id', id).del().catch(function(error) {
        console.error(error);
      });
      io.emit('delete', id);
      // console.log('Deleted', id);
    });
  });
}
