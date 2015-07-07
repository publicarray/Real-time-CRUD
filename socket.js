module.exports = function (io, knex, escapeHtml, config) {
  "use strict";
  io.on('connection', function (socket) {
    socket.on('add', function (data) {
      var object = {};
      var colNo = 0;
      for (var column in config.table) {
        if (config.table.hasOwnProperty(column)) {
          if (config.table[column] === 'boolean') {
            object[column] = parseInt(data[colNo], 10) === 1 ? true : false;
          } else if (config.table[column] === 'integer') {
            object[column] = parseFloat(data[colNo], 10) || 0;
          } else {
            object[column] = escapeHtml(data[colNo]);
          }
          colNo++;
        }
      }

      knex(config.tableName)
        .returning('id') // for PostgreSQL
        .insert(object)
        .then(function(rows) {
          object.id = rows[0]; // get last id from db and add to the end of object
          io.emit('add', object);
          // console.log('Created', object);
        })
        .catch(function(error) {
          console.error(error);
        }
      );
    });

    socket.on('update', function (data) {
      var object = {};
      var colNo = 2; // skip first argument (id)
      var id = parseInt(data[1], 10);
      for (var column in config.table) {
        if (config.table.hasOwnProperty(column)) {
          if (config.table[column] === 'boolean') {
            object[column] = parseInt(data[colNo], 10) === 1 ? true : false;
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
        .catch(function(error) {
          console.error(error);
        }
      );
      object.id = id; // add to the id the end of object
      io.emit('update', object);
      // console.log('Updated', object);
    });
    socket.on('delete', function (id) {
      id = escapeHtml(id);
      knex(config.tableName)
        .where('id', id)
        .del()
        .catch(function(error) {
          console.error(error);
        }
      );
      io.emit('delete', id);
      // console.log('Deleted', id);
    });
  });
};
