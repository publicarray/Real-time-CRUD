var socket = io();

function checkbox (data) {
  $(':checkbox', $('#'+data.id)).change(function(){
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
    socket.emit('update', id, name, ring, done);
  });
}

function delBtn (id) {
  console.log('delete '+id);
  $('.btn-danger', $('#'+id)).on('click', function(){
    socket.emit('delete', id);
  });
}

function display (data) {
  var done = parseInt(data.done);
  var style = '';
  if (done === 0) {
    done = '<input type="checkbox">';
  } else {
    done = '<input type="checkbox" checked>';
    style = 'class="danger"';
  }
  var htmlStr = '<tr '+style+' id="'+data.id+'"><td>' + data.id + '</td><td>' + data.name + '</td><td>' + data.ring + '</td><td>' + done + '</td><td><button type="button" class="btn btn-danger">Delete</button></td></tr>';
  return htmlStr;
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
    socket.emit('update', id, name, ring, done);
  });

  $('.btn-danger').on('click', function() {
    var line = $(this).parent().parent();
    // potentialy dangerous
    var id = line.find('td:nth-child(1)').text();
    socket.emit('delete', id);
  });

  $('#create').submit(function() {
    var done = 0;
    // if ($('#done').prop('checked')) {
    //   done = 1;
    // }
    socket.emit('add', $('#name').val(), $('#ring').val(), done);
      $('#name').val('');
      $('#ring').val('');
      return false;
  });

  socket.on('add', function (data) {
    $('#data').append(display(data));
    checkbox(data);
    delBtn(data.id);
  });
  socket.on('update', function (data) {
    $('#'+data.id).replaceWith(display(data));
    checkbox(data);
    delBtn(data.id);
  });
  socket.on('delete', function (data) {
    $('#'+data).remove();
  });
});
