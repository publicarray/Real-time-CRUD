function display (data) {
  var htmlStr = '';
  for (var i = 0; i < data.length; i++) {
    var done = data[i].done;
    var style = '';
    if (done === 0) {
      done = '<input type="checkbox">';
    } else {
      done = '<input type="checkbox" checked>';
      style = 'class="danger"';
    }
    htmlStr += '<tr '+style+' id="'+data[i].id+'"><td>' + data[i].id + '</td><td>' + data[i].name + '</td><td>' + data[i].ring + '</td><td>' + done + '</td></tr>';
  }
  $('#data').append(htmlStr);
}

function update (data) {
  var done = parseInt(data[0].done);
  var style = '';
  if (done === 0) {
    done = '<input type="checkbox">';
  } else {
    done = '<input type="checkbox" checked>';
    style = 'class="danger"';
  }
  var htmlStr = '<tr '+style+' id="'+data[0].id+'"><td>' + data[0].id + '</td><td>' + data[0].name + '</td><td>' + data[0].ring + '</td><td>' + done + '</td></tr>';
  $('#'+data[0].id).replaceWith(htmlStr);
}

$(document).ready(function() {
  var socket = io();
  $.get('/data', function(data) {
    display(data);
    $("input[type='checkbox']").on('change', function(){
      var checkbox = $(this);
      var line = $(this).parent().parent();
      var done = 0;
      if (checkbox.prop('checked')) {
        done = 1;
      }
      line.toggleClass('danger');
      // potentialy dangerous
      var id = line.find('td:nth-child(1)').text();
      var name = line.find('td:nth-child(2)').text();
      var ring = line.find('td:nth-child(3)').text();
      socket.emit('update', id, name, ring, done);
    });
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
});
