// Copyright Sebastian Schmidt
var socket = io();
var doc = document;

function display (data) {
  var done = parseInt(data.done);
  var style = '';
  if (done === 0) {
    data.done = '<input type="checkbox">';
  } else {
    data.done = '<input type="checkbox" checked>';
    style = ' class="success"';
  }
  var htmlStr = '<tr id="'+data.id+'"'+style+'>';
  htmlStr += '<td>' + data.id + '</td>';
  for (var prop in data) {
    if (prop !== 'id'){
      htmlStr += '<td>' + data[prop] + '</td>';
    }
  }
  return htmlStr += '<td><button class="btn btn-primary modelBtn" type="button" data-toggle="modal" data-target="#editModal" onclick="modalData(this)">Edit</button></td><td><button type="button" class="btn btn-danger">Delete</button></td></tr>';
}

function reset() {
  doc.getElementById('idModel').textContent = '';
  doc.getElementById('nameModel').value = '';
  doc.getElementById('ringModel').value = '';
  doc.getElementById('competitorsModel').value = '';
  doc.getElementById('orderNoModel').value = '';
  doc.getElementById('doneModel').textContent = '';
}

function edit() {
  var id = doc.getElementById('idModel').textContent;
  var name = doc.getElementById('nameModel').value;
  var ring = doc.getElementById('ringModel').value;
  var competitors = doc.getElementById('competitorsModel').value;
  var orderNo = doc.getElementById('orderNoModel').value;
  var done = doc.getElementById('doneModel').textContent;
  socket.emit('update', id, name, ring, competitors, orderNo, done);
  reset();
}

$(document).ready(function() {
  $('#data').on('change', ':checkbox', function() {
    var checkbox = $(this);
    var line = $(this).parent().parent();
    var done = 0;
    if (checkbox.prop('checked')) {
      done = 1;
    }
    // potentialy dangerous
    var id = line.find('td:nth-child(1)').text();
    var name = line.find('td:nth-child(2)').text();
    var ring = line.find('td:nth-child(3)').text();
    var competitors = line.find('td:nth-child(4)').text();
    var orderNo = line.find('td:nth-child(5)').text();
    socket.emit('update', id, name, ring, competitors, orderNo, done);
  });

  $('#data').on('click', '.btn-danger', function() {
    var line = $(this).parent().parent();
    // potentialy dangerous
    var id = line.find('td:nth-child(1)').text();
    socket.emit('delete', id);
  });

  // function modalData(e) {
  //   // var line  = e.parentNode.innerHTML = 'stuff';
  //   // var line  = e.parentNode.parentNode;
  //   var line = $(e).parent().parent();
  //   var checkbox = line.find(':checkbox');
  //   // potentialy dangerous
  //   var id = line.find('td:nth-child(1)').text();
  //   var name = line.find('td:nth-child(2)').text();
  //   var ring = line.find('td:nth-child(3)').text();
  //   var comp = line.find('td:nth-child(4)').text();
  //   var orderNo = line.find('td:nth-child(5)').text();
  //   var done = 0;
  //   if (checkbox.prop('checked')) {
  //     done = 1;
  //   }
  //   doc.getElementById('idModel').textContent = id;
  //   doc.getElementById('nameModel').value = name;
  //   doc.getElementById('ringModel').value = ring;
  //   doc.getElementById('compModel').value = comp;
  //   doc.getElementById('orderModel').value = orderNo;
  //   doc.getElementById('doneModel').textContent = done;
  // }

  $('#data').on('click', '.modelBtn', function() {
    var line = $(this).parent().parent();
    var checkbox = line.find(':checkbox');
    // potentialy dangerous
    var id = line.find('td:nth-child(1)').text();
    var name = line.find('td:nth-child(2)').text();
    var ring = line.find('td:nth-child(3)').text();
    var competitors = line.find('td:nth-child(4)').text();
    var orderNo = line.find('td:nth-child(5)').text();
    var done = 0;
    if (checkbox.prop('checked')) {
      done = 1;
    }
    doc.getElementById('idModel').textContent = id;
    doc.getElementById('nameModel').value = name;
    doc.getElementById('ringModel').value = ring;
    doc.getElementById('competitorsModel').value = competitors;
    doc.getElementById('orderNoModel').value = orderNo;
    doc.getElementById('doneModel').textContent = done;
  });

  $('#create').submit(function() {
    var done = 0;
    if (document.getElementById('done').checked) {
      done = 1
    }
    socket.emit('add', $('#name').val(), $('#ring').val(), $('#competitors').val(), $('#orderNo').val(), done);
      doc.getElementById('name').value = '';
      doc.getElementById('ring').value = '';
      doc.getElementById('competitors').value = '';
      doc.getElementById('orderNo').value = '';
      return false;
  });

  socket.on('add', function (data) {
    doc.getElementById('data').innerHTML += (display(data));
  });
  socket.on('update', function (data) {
    doc.getElementById(data.id).outerHTML = (display(data));
  });
  socket.on('delete', function (data) {
    doc.getElementById(data).remove();
  });
  socket.on('disconnect',function() {
    $('#alert').fadeIn(1000);
  });
  socket.on('connect',function() {
    $('#alert').fadeOut(1000);
  });
});
