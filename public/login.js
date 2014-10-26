$(document).ready(function () {
  $('form').submit(function(event) {
    event.preventDefault();
    var name = $('#name').val();
    var pass = $('#pass').val();
    var min = Math.round(new Date().getTime() / 10000);
    var url = document.URL.split("?");
    url = url[0] + '?hash=' + btoa('{"name": "'+name+'", "pass": "'+pass+'", "time": "'+min+'"}');
    window.location.href = url;
  });
});
