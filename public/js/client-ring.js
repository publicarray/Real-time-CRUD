/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var url = window.location.href;
var ring = parseInt(url.substr(url.lastIndexOf('/')+1));
var table = document.getElementById('table');
var sort = new Tablesort(table);

function display (data) {
  var firstLine = '<tr id='+data.id+'>';
  var htmlStr = '';
  for (var prop in data) {
    if (typeof data[prop] === 'boolean') {
      if (data[prop]) {
        firstLine = '<tr id='+data.id+' class="success">';
        data[prop] = 'Yes';
      } else {
        data[prop] = 'No';
      }
    }
    if (prop !== 'id'){
      htmlStr += '<td>' + data[prop] + '</td>';
    }
  }
  return firstLine + htmlStr + '</tr>';
}

$(document).ready(function () {
  var socket = io();

  socket.on('add', function (data) {
    if (data.Ring === Ring) {
      document.getElementById('data').innerHTML += (display(data));
      sort.refresh();
    }
  });
  socket.on('update', function (data) {
    if (data.Ring === Ring) {
      document.getElementById(data.id).outerHTML = (display(data));
      sort.refresh();
    }
  });
  socket.on('delete', function (id) {
    document.getElementById(id).remove();
  });
  socket.on('disconnect',function () {
    $('#alert').fadeIn(1000);
  });
  socket.on('connect',function () {
    $('#alert').fadeOut(1000);
  });
});
