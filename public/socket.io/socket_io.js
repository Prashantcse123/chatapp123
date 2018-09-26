
var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var onlineUsers = [];
var users = [];
var i = 1;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '')));
app.get('/chat/chatRoom', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/chat', function (req, res) {
  res.render('chatRoom');
});

app.get('/', function (req, res) {
  res.send("I am server running on 8888");
});

const filterInPlace = (array, predicate) => {
  let end = 0;

  for (let i = 0; i < array.length; i++) {
    const obj = array[i];

    if (predicate(obj)) {
      array[end++] = obj;
    }
  }
  array.length = end;
};


function removeA(arr) {
  var what, a = arguments, L = a.length, ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}



io.on('connection', function (socket) {
  
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });


  socket.on('usersAdd', function (msg) {
    users.push(msg)
    console.log('New connection from ' + socket.id);
    console.log('----------------New User added-----------------')
    onlineUsers.push({ userName: "user1" + Date.now(), client: socket, socketID: socket.id, myname: msg })
    console.log(onlineUsers)
    console.log('----------------New User added-----------------')
    io.emit('usersAdd', users);
  });


  socket.on('usersRemove', function (msg) {
    removeA(users, msg)
    io.emit('usersRemove', users);
  });


  socket.on('disconnect', function () {
    const toDelete = new Set([socket.id]);
    filterInPlace(onlineUsers, obj => !toDelete.has(obj.socketID));
    console.log('----------------Delete user-----------------')
    console.log(onlineUsers);
    console.log('----------------Delete user-----------------')
  });


});


http.listen(8888, function () {
  console.log('listening on *:8888');
})
