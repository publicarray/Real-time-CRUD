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
