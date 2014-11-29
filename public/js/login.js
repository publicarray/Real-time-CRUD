/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
$(document).ready(function () {
  $('form').submit(function (e) {
    e.preventDefault();
    var url = document.URL.split("?");
    window.location.href  = url[0] + '?hash=' + btoa(JSON.stringify({"name" : $('#name').val(), "pass" : $('#pass').val(), "time" : Math.round(new Date().getTime() / 1000)}));
  });
});
