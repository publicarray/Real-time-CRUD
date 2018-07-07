var table = document.getElementById('table');
var sort = new Tablesort(table);

function display(data) {
  var firstLine = '<tr id=' + data.id + '>';
  var htmlStr = '';
  var prop;
  for (prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (typeof data[prop] === 'boolean') {
        if (data[prop]) {
          firstLine = '<tr id=' + data.id + ' class="bg-success text-white">';
          data[prop] = 'Yes';
        } else {
          data[prop] = 'No';
        }
      }
      if (prop !== 'id') {
        htmlStr += '<td>' + data[prop] + '</td>';
      }
    }
  }
  return firstLine + htmlStr + '</tr>';
}
