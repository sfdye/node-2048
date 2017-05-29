var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var channelName = -1;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

//Start on connection
io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');

    // stop the game
    io.to(socket.channelName).emit('stop');
  });

  //Set room for user when connection is made
  socket.on('setChannel', function (id) {
    channelName = id;
    socket.join(channelName);
    console.log('one user joined room: ' + channelName);
  });

  socket.on('joinChannel', function (id) {
    console.log('one user joined room: ' + id);
    console.log('channelName is ' + channelName);
    // join name if id is a match
    if (id == channelName) {
      console.log('id match, joining room: ' + channelName);
      socket.join(id);
      socket.channelName = channelName;
      io.to(channelName).emit('start', 'some thing');
    }
  });

  socket.on('move', function(dir){
    console.log('direction: ' + dir);
    console.log('channelName is ' + channelName);
  io.to(channelName).emit('move', dir);
  });

  socket.on('authUser', function (data) {
    io.to(channelName).emit('welcome', data);
  });

});

http.listen(3333, function(){
  console.log('listening on port 3333');
});
