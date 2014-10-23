function display (data) {
  // console.log(data);
  var htmlStr = '';
  for (var i = 0; i < data.length; i++) {
    done = data[i]['done'];
    if (done === 0) {
      done = 'No';
    } else {
      done = 'Yes';
    }

    htmlStr += '<tr><td>' + data[i]['id'] + '</td><td>' + data[i]['name'] + '</td><td>' + data[i]['ring'] + '</td><td>' + done + '</td></tr>';
  }
  $('#data').append(htmlStr);
}

$(document).ready(function() {
  $.get('/data', function(data) {
    display(data);
  });

  var socket = io();
  $('form').submit(function() {
    socket.emit('add', $('#name').val(), $('#ring').val());
      $('#name').val('');
      $('#ring').val('');
      return false;
  });
  socket.on('add', function (data) {
    console.log(data);
    display(data);
  });



});
