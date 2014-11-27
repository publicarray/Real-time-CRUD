// Copyright Sebastian Schmidt
var table = document.getElementById('table');
var sort = new Tablesort(table);

function display (data) {
  var done = parseInt(data.done);
  var style = '';
  if (done === 0) {
    data.done = 'No';
  } else {
    data.done = 'Yes';
    style = ' class="success"';
  }
  var htmlStr = '<tr id="'+data.id+'"'+style+'>';
  for (var prop in data) {
    console.log(prop + " is " + data[prop]);
    if (prop !== 'id' && prop !== 'orderNo'){
      htmlStr += '<td>' + data[prop] + '</td>';
    }
  }
  return htmlStr;
}

$(document).ready(function() {
  var socket = io();

  socket.on('add', function (data) {
    document.getElementById('data').innerHTML += (display(data));
    sort.refresh();
  });
  socket.on('update', function (data) {
    document.getElementById(data.id).outerHTML = (display(data));
    sort.refresh();
  });
  socket.on('delete', function (data) {
    document.getElementById(data).remove();
  });
  socket.on('disconnect',function() {
    $('#alert').fadeIn(1000);
  });
  socket.on('connect',function() {
    $('#alert').fadeOut(1000);
  });
});
