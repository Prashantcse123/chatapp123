
function showChatBox(me) {
  $(".chat-box").removeClass("hide");
  var qs = getQueryStrings();
  var myParam = qs["username"];
  $('#mname').val(myParam);
  $('#fname').val(me);
}


function hideChatBox() {
  console.log("hello")
  $(".chat-box").addClass("hide");
}



$(function () {
  var textarea = $('.chat-text textarea');
  textarea.keypress(function (event) {
    var $this = $(this);

    if (event.keyCode == 13) {
      var msg = $this.val();
      $this.val('');
      $('.msg-insert').prepend("<div class='msg-send'>" + msg + "</div>");
    }
  });

});




function getQueryStrings() {
  var assoc = {};
  var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
  var queryString = location.search.substring(1);
  var keyValues = queryString.split('&');

  for (var i in keyValues) {
    var key = keyValues[i].split('=');
    if (key.length > 1) {
      assoc[decode(key[0])] = decode(key[1]);
    }
  }
  return assoc;
}


function getValue() {
  var qs = getQueryStrings();
  var myParam = qs["username"];
  return myParam;
}


var qs = getQueryStrings();
var myParam = qs["username"];
$(function () {
  var socket = io();
  socket.emit('usersAdd', myParam)
  $('#exit').click(function () {
    alert('emitted')
    socket.emit('usersRemove', myParam)
  });


  $('form').submit(function () {
    socket.emit('chat message', myParam + ":" + $('#m').val());
    $('#m').val('');
    return false;
  });



  socket.on('chat message', function (msg) {
    var str = msg;
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    $('#messages').append($('<li>').append('<div class="container"><img src="/user.png" alt="User"><p>' + str + '</p><span class="time-right">' + time + '</span></div>'));
  });

  socket.on('usersAdd', function (msg) {
    $('#onlineusers').empty();
    var result = msg;
    for (var i = 0; i < result.length; i++) {
      var imgAttr = $('<img class="user"/>').height(20).width(20).after(result[i]);
      imgAttr.attr('src', '/user.png');
      var str = result[i];
      $('#onlineusers').append($('<li style="list-style-type:none">').append(imgAttr).append("<a id=" + str + ">" + str + '</a>'));
    }
  });



  socket.on('usersRemove', function (msg) {
    $('#onlineusers').empty();
    var result = msg || 'Anonymous';
    for (var i = 0; i < result.length; i++) {
      var imgAttr = $('<img/>').height(20).width(20).after(result[i]);
      imgAttr.attr('src', '/user.png');
      var str = result[i];
      $('#onlineusers').append($('<li style="list-style-type:none">').append(imgAttr).append("<a id=" + str + ">" + str + '</a>'));
    }
  });
});

