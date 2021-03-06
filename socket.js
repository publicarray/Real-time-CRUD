module.exports = function socketIO(io, knex, escapeHtml, config) {
  'use strict';
  io.on('connection', function connection(socket) {
    // Note this API is public
    // FixMe: add Auth checks -> https://www.npmjs.com/package/socketio-auth or https://github.com/jfromaniello/passport.socketio
    socket.on('add', function add(data) {
      var object = {};
      var colNo = 0;
      var column;
      for (column in config.table) {
        if (config.table.hasOwnProperty(column)) {
          if (config.table[column] === 'boolean') {
            object[column] = (parseInt(data[colNo], 10) === 1);
          } else if (config.table[column] === 'integer') {
            object[column] = parseFloat(data[colNo], 10) || 0;
          } else {
            object[column] = escapeHtml(data[colNo]);
          }
          colNo++;
        }
      }

      knex(config.tableName)
        .returning('id') // For PostgreSQL
        .insert(object)
        .then(function (rows) {
          object.id = rows[0]; // Get last id from db and add to the end of object
          io.emit('add', object);
          // console.log("Created", object);
        })
        .catch(function printError(err) {
          console.error(err);
        });
    });

    socket.on('update', function update(data) {
      var object = {};
      var colNo = 2; // Skip first argument (id)
      var column;
      var id = parseInt(data[1], 10);
      for (column in config.table) {
        if (config.table.hasOwnProperty(column)) {
          if (config.table[column] === 'boolean') {
            object[column] = (parseInt(data[colNo], 10) === 1);
          } else if (config.table[column] === 'integer') {
            object[column] = parseFloat(data[colNo], 10) || 0;
          } else {
            object[column] = escapeHtml(data[colNo]);
          }
          colNo++;
        }
      }
      knex(config.tableName)
        .where('id', id)
        .update(object)
        .catch(function printError(err) {
          console.error(err);
        });
      object.id = id; // Add to the id the end of object
      io.emit('update', object);
      // console.log("Updated", object);
    });

    socket.on('delete', function remove(id) {
      id = escapeHtml(id);
      knex(config.tableName)
        .where('id', id)
        .del()
        .catch(function printError(err) {
          console.error(err);
        });
      io.emit('delete', id);
      // console.log("Deleted", id);
    });
  });
};
