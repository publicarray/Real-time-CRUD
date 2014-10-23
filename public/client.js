function update (data) {
  var done = parseInt(data[0].done);
  var style = '';
  if (done === 0) {
    done = 'No';
  } else {
    done = 'Yes';
    style = 'class="danger"';
  }
  var htmlStr = '<tr '+style+' id="'+data[0].id+'"><td>' + data[0].id + '</td><td>' + data[0].name + '</td><td>' + data[0].ring + '</td><td>' + done + '</td></tr>';
  $('#'+data[0].id).replaceWith(htmlStr);
}

$(document).ready(function() {
  var socket = io();

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
});
