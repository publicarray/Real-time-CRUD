$(document).ready(function () {
  $('form').submit(function (e) {
    e.preventDefault();
    var url = document.URL.split("?");
    window.location.href  = url[0] + '?hash=' + btoa(JSON.stringify({"name" : $('#name').val(), "pass" : $('#pass').val(), "time" : Math.round(new Date().getTime() / 1000)}));
  });
});
