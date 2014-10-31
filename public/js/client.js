// Copyright Sebastian Schmidt
var table = document.getElementById('table');
var sort = new Tablesort(table);

function display (data) {
  var done = parseInt(data.done);
  var style = '';
  if (done === 0) {
    done = 'No';
  } else {
    done = 'Yes';
    style = 'class="success"';
  }
  var htmlStr = '<tr '+style+' id="'+data.id+'"><td>' + data.name + '</td><td><a href="/'+data.ring+'">' + data.ring + '</td><td>' + data.comp + '</td><td>' + done + '</td></tr>';
  return htmlStr;
}

$(document).ready(function() {
  var socket = io();

  socket.on('add', function (data) {
    $('#data').append(display(data));
    sort.refresh();
  });
  socket.on('update', function (data) {
    $('#'+data.id).replaceWith(display(data));
    sort.refresh();
  });
  socket.on('delete', function (data) {
    $('#'+data).remove();
  });
  socket.on('disconnect',function() {
    $('#alert').fadeIn(1000);
  });
  socket.on('connect',function() {
    $('#alert').fadeOut(1000);
  });
});
