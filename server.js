const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

/////////////////////////////////////////////
// routing
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/learn', function(req, res){
  res.sendFile(__dirname + '/learn.html');
});

//public
app.use('/public', express.static('public'));
app.use('/dist', express.static('dist'));

/////////////////////////////////////////////
// socket
io.on('connection', (socket) => {
  socket.on('move', (msg) => {
    console.log(msg)
    io.emit('move', msg);
  });
  socket.on('chat message', (msg) => {
    console.log(msg)
    io.emit('chat message', msg);
  });
});

http.listen(3000);
