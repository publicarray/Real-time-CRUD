// Copyright Sebastian Schmidt
function display (data) {
  var done = parseInt(data.done);
  var style = '';
  if (done === 0) {
    done = 'No';
  } else {
    done = 'Yes';
    style = 'class="warning"';
  }
  var htmlStr = '<tr '+style+' id="'+data.id+'"><td>' + data.name + '</td><td>' + data.ring + '</td><td>' + data.comp + '</td><td>' + done + '</td></tr>';
  return htmlStr;
}

$(document).ready(function() {
  var socket = io();

  socket.on('add', function (data) {
    $('#data').append(display(data));
  });
  socket.on('update', function (data) {
    $('#'+data.id).replaceWith(display(data));
  });
  socket.on('delete', function (data) {
    $('#'+data).remove();
  });
  socket.on('disconnect',function() {
    $('#alert').fadeIn(1000);
    console.log('The client has disconnected!');
  });
  socket.on('connect',function() {
    $('#alert').fadeOut(1000);
    console.log('The client has reconnected!');
  });
});
