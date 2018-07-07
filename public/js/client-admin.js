var socket = io();
var doc = document;

function display(data) {
  var firstLine = '<tr id=' + data.id + '>';
  var htmlStr = '<td>' + data.id + '</td>'; // Display the id first
  var prop;
  for (prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (typeof data[prop] === 'boolean') {
        if (data[prop]) {
          firstLine = '<tr id=' + data.id + ' class="bg-success text-white">';
          data[prop] = '<input type="checkbox" checked>';
        } else {
          data[prop] = '<input type="checkbox">';
        }
      }
      if (prop !== 'id') {
        htmlStr += '<td>' + data[prop] + '</td>';
      }
    }
  }
  return firstLine + htmlStr + '<td><button class="btn btn-primary modelBtn" ' +
    'type="button" data-toggle="modal" data-target="#editModal">Edit</button></td>' +
    '<td><button type="button" class="btn btn-danger">Delete</button></td></tr>';
}

function reset() {
  doc.getElementById('idModel').textContent = '';
  $('.model').each(function (index, element) {
    element.value = '';
  });
}

// Update
function edit() {
  var data = [];
  data[1] = doc.getElementById('idModel').textContent;
  $('.model').each(function (index, element) {
    if ($(this).is(':checkbox')) {
      data[index + 2] = $(this).prop('checked') ? 1 : 0;
    } else {
      data[index + 2] = element.value;
    }
  });
  socket.emit('update', data);
  reset();
}

$(document).ready(function () {
  // Check-box update
  $('#data').on('change', ':checkbox', function () {
    var line = $(this).parent().parent();
    var data = [];
    for (var i = 1; i <= line.children().length - 2; i++) { // Items in the row - the 2 buttons; start at child 1
      var td = line.find('td:nth-child(' + i + ')');
      if (td.contents().is('input')) {
        if (td.contents().prop('checked')) {
          data[i] = 1;
        } else {
          data[i] = 0;
        }
      } else {
        data[i] = td.text(); // From left to right
      }
    }
    socket.emit('update', data);
  });
  // Delete button
  $('#data').on('click', '.btn-danger', function () {
    var line = $(this).parent().parent();
    var id = line.find('td:nth-child(1)').text();
    socket.emit('delete', id);
  });
  // Push data to model / pop-up
  $('#data').on('click', '.modelBtn', function () {
    var line = $(this).parent().parent();
    var data = [];
    for (var i = 1; i <= line.children().length - 2; i++) { // Items in the row - the 2 buttons; start at child 1
      var td = line.find('td:nth-child(' + i + ')');
      if (td.contents().is('input')) {
        if (td.contents().prop('checked')) {
          data[i] = 1;
        } else {
          data[i] = 0;
        }
      } else {
        data[i] = td.text(); // From left to right
      }
    }

    doc.getElementById('idModel').textContent = data[1];
    $('.model').each(function (index, element) {
      if ($(this).is(':checkbox')) {
        if (data[index + 2]) {
          $(this).prop('checked', true);
        } else {
          $(this).prop('checked', false);
        }
      } else {
        element.value = data[index + 2];
      }
    });
  });
  // Create
  $('#create').submit(function () {
    var data = [];
    $('.input').each(function (index, element) {
      if ($(this).is(':checkbox')) {
        if ($(this).prop('checked')) {
          data[index] = 1;
        } else {
          data[index] = 0;
        }
      } else {
        data[index] = element.value;
      }
    });
    socket.emit('add', data);
    // Reset input
    $('.input').each(function (index, element) {
      element.value = '';
    });
    return false;
  });

  socket.on('add', function add(data) {
    doc.getElementById('data').innerHTML += (display(data));
  });
  socket.on('update', function update(data) {
    doc.getElementById(data.id).outerHTML = (display(data));
  });
  socket.on('delete', function remove(id) {
    doc.getElementById(id).remove();
  });
  socket.on('disconnect', function disconnect() {
    fadeIn('#alert')
  });
  socket.on('connect', function connect() {
    fadeOut('#alert')
  });
});
