$(document).ready(function () {
  $('form').submit(function(event) {
    event.preventDefault();
    var name = $('#name').val();
    var pass = $('#pass').val();
    var now = new Date();
    var min = Math.round((now.getTime() + (now.getTimezoneOffset() * 60000)) / 60000);
    var url = document.URL.split("?");
    url = url[0] + '?hash=' + btoa('{"name": "'+name+'", "pass": "'+pass+'", "time": "'+min+'"}');
    window.location.href = url;
  });
});
