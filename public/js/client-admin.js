/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var socket = io();
var doc = document;

function display (data) {
  var firstLine = '<tr id='+data.id+'>';
  var htmlStr = '<td>' + data.id + '</td>'; // display the id first
  for (var prop in data) {
    if (typeof data[prop] === 'boolean') {
      if (data[prop]) {
        firstLine = '<tr id='+data.id+' class="success">';
        data[prop] = '<input type="checkbox" checked>';
      } else {
        data[prop] = '<input type="checkbox">';
      }
    }
    if (prop !== 'id'){
      htmlStr += '<td>' + data[prop] + '</td>';
    }
  }
  return firstLine + htmlStr + '<td><button class="btn btn-primary modelBtn" type="button" data-toggle="modal" data-target="#editModal">Edit</button></td><td><button type="button" class="btn btn-danger">Delete</button></td></tr>';
}

function reset () {
  doc.getElementById('idModel').textContent = '';
  $('.model').each( function (index, element) {
    element.value = '';
  });
}
// update
function edit () {
  var data = [];
  data[1] = doc.getElementById('idModel').textContent;
  $('.model').each(function (index, element) {
    if ($(this).is(':checkbox')) {
      data[index+2] = $(this).prop('checked') ? 1 : 0;
    } else {
      data[index+2] = element.value;
    }
  });
  socket.emit('update', data);
  reset();
}

$(document).ready(function() {
  // check-box update
  $('#data').on('change', ':checkbox', function () {
    var line = $(this).parent().parent();
    var data = [];
    for (var i = 1; i <= line.children().length-2; i++) {  // items in the row - the 2 buttons; start at child 1
      var td = line.find('td:nth-child('+i+')');
      if (td.contents().is('input')) {
        if (td.contents().prop('checked')) {
          data[i] = 1;
        } else {
          data[i] = 0;
        }
      } else {
        data[i] = td.text(); // from left to right
      }
    }
    socket.emit('update', data);
  });
  // delete button
  $('#data').on('click', '.btn-danger', function () {
    var line = $(this).parent().parent();
    var id = line.find('td:nth-child(1)').text();
    socket.emit('delete', id);
  });
  // create model
  $('#data').on('click', '.modelBtn', function () {
    var line = $(this).parent().parent();
    var data = [];
    for (var i = 1; i <= line.children().length-2; i++) {  // items in the row - the 2 buttons; start at child 1
      var td = line.find('td:nth-child('+i+')');
      if (td.contents().is('input')) {
        if (td.contents().prop('checked')) {
          data[i] = 1;
        } else {
          data[i] = 0;
        }
      } else {
        data[i] = td.text(); // from left to right
      }
    }

    doc.getElementById('idModel').textContent = data[1];
    $('.model').each( function (index, element) {
      if ($(this).is(':checkbox')) {
        if (data[index+2]) {
          $(this).prop('checked', true);
        } else {
          $(this).prop('checked', false);
        }
      } else {
        element.value = data[index+2];
      }
    });
  });
  // create
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
    // reset input
    $('.input').each( function (index, element) {
      element.value = '';
    });
    return false;
  });

  socket.on('add', function (data) {
    doc.getElementById('data').innerHTML += (display(data));
  });
  socket.on('update', function (data) {
    doc.getElementById(data.id).outerHTML = (display(data));
  });
  socket.on('delete', function (id) {
    doc.getElementById(id).remove();
  });
  socket.on('disconnect',function () {
    $('#alert').fadeIn(1000);
  });
  socket.on('connect',function () {
    $('#alert').fadeOut(1000);
  });
});
