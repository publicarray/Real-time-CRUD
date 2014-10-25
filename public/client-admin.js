// Copyright Sebastian Schmidt
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
    var comp = line.find('td:nth-child(4)').text();
    socket.emit('update', id, name, ring, comp, done);
  });
}

function delBtn (id) {
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
    style = 'class="info"';
  }
  var htmlStr = '<tr '+style+' id="'+data.id+'"><td>' + data.id + '</td><td>' + data.name + '</td><td>' + data.ring + '</td><td>' + data.comp + '</td><td>' + done + '</td><td><button type="button" class="btn btn-danger">Delete</button></td></tr>';
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
    var comp = line.find('td:nth-child(4)').text();
    socket.emit('update', id, name, ring, comp, done);
  });

  $('.btn-danger').on('click', function() {
    var line = $(this).parent().parent();
    // potentialy dangerous
    var id = line.find('td:nth-child(1)').text();
    socket.emit('delete', id);
  });

  $('#create').submit(function() {
    var done = 0;
    if (document.getElementById('done').checked) {
      done = 1
    }
    socket.emit('add', $('#name').val(), $('#ring').val(), $('#comp').val(), done);
      $('#name').val('');
      $('#ring').val('');
      $('#comp').val('');
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
    $('#'+data).remove('#'+data);
  });
  socket.on('disconnect',function() {
    $('#alert').fadeIn(1000);
  });
  socket.on('connect',function() {
    $('#alert').fadeOut(1000);
  });
});
