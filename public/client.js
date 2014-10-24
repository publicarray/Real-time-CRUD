function display (data) {
  var done = parseInt(data.done);
  var style = '';
  if (done === 0) {
    done = 'No';
  } else {
    done = 'Yes';
    style = 'class="danger"';
  }
  var htmlStr = '<tr '+style+' id="'+data.id+'"><td>' + data.name + '</td><td>' + data.ring + '</td><td>' + done + '</td></tr>';
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
});
