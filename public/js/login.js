function escapeHtml(text) {
  text = text.toString();
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;'
  };
  return text.replace(/[&<>"'\/]/g, function (m) { return map[m]; });
}

$(document).ready(function () {
  $('form').submit(function(event) {
    event.preventDefault();
    var name = escapeHtml($('#name').val());
    var pass = escapeHtml($('#pass').val());
    var min = Math.round(new Date().getTime() / 1000);
    var url = document.URL.split("?");
    url = url[0] + '?hash=' + btoa(JSON.stringify({"name" : name, "pass" : pass, "time" : min}));
    window.location.href = url;
  });
});
