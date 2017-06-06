var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var validator = require('validator');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('username set', function(name){
    socket.nickname = validator.blacklist(name);
    io.emit('connect message', socket.nickname + " has connected");
  });

  socket.on('chat message', function(msg){
    msg = validator.blacklist(socket.nickname + ': ' + msg);
    console.log(msg);
    io.emit('chat message', msg);
  });
});

io.on('connection', function(socket){
  console.log('a user connected: ');
  socket.on('disconnect', function(){
    console.log('user disconnected: ' + socket.nickname);
    io.emit('disconnect message', socket.nickname + " has disconnected");
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
