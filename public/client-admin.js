var socket = io();

function update (data) {
  var done = parseInt(data[0].done);
  var style = '';
  if (done === 0) {
    done = '<input type="checkbox">';
  } else {
    done = '<input type="checkbox" checked>';
    style = 'class="danger"';
  }
  var htmlStr = '<tr '+style+' id="'+data[0].id+'"><td>' + data[0].id + '</td><td>' + data[0].name + '</td><td>' + data[0].ring + '</td><td>' + done + '</td><td><button type="button" class="btn btn-danger">Delete</button></td></tr>';
  $('#'+data[0].id).replaceWith(htmlStr);
  $(':checkbox', $('#'+data[0].id)).change(function(){
      var checkbox = $(this);
      var line = $(this).parent().parent();
      var done = 0;
      if (checkbox.prop('checked')) {
        done = 1;
      }
      // potentialy dangerous
      var id = line.find('td:nth-child(1)').text();
      var name = line.find('td:nth-child(2)').text();
      var ring = line.find('td:nth-child(3)').text();
      console.log(id + ' Updated');
      socket.emit('update', id, name, ring, done);
    });
}

function del (data) {
  $('.btn-danger').on('click', function(){
      var btn = $(this);
      var line = $(this).parent().parent();
      // potentialy dangerous
      var id = line.find('td:nth-child(1)').text();
      console.log(id + 'Deleted');
      socket.emit('del', id);
    });
}

$(document).ready(function() {
  $(':checkbox', $('#data')).change(function(){
    var checkbox = $(this);
    var line = $(this).parent().parent();
    var done = 0;
    if (checkbox.prop('checked')) {
      done = 1;
    }
    // potentialy dangerous
    var id = line.find('td:nth-child(1)').text();
    var name = line.find('td:nth-child(2)').text();
    var ring = line.find('td:nth-child(3)').text();
    console.log(id + ' Updated');
    socket.emit('update', id, name, ring, done);
  });

  $('#create').submit(function() {
    socket.emit('add', $('#name').val(), $('#ring').val());
      $('#name').val('');
      $('#ring').val('');
      return false;
  });
  socket.on('add', function (data) {
    display(data);
  });
  socket.on('update', function (data) {
    update(data);
  });
  socket.on('delete', function (data) {
    del(data);
  });
});
