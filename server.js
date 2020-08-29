const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//const express = require('./app/module.js')

app.set('view engine', 'pug');

/////////////////////////////////////////////
// routing
app.get('/', function(req, res){
  res.render('index', { game: 'Hhageello' });
});

//ゲームを後で検証するために使う
app.get('/:gameId([a-zA-Z0-9]{8})', function(req, res){
  //example
  const game = {
    id: "game1",
    status: { id:20, name:"started"},
    player: "black",
    turns: 1,
  }
  res.render('index', {game:JSON.stringify(game)});
});

//ゲームの黒番、白番が使用する。
app.get('/:gameId([a-zA-Z0-9]{12})', function(req, res){
  const game = {
    id: req.params.gameId.substr(0, 8),
    status: { id:20, name:"started"},
    player: "black",
    turns: 1,
  }
  console.log(game)
  res.render('index', {game:JSON.stringify(game)});
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/lobby.html');
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

/* サーバー側で
　plyの管理 (インクリメント)
　時間の管理 (increment?)
　fenの生成
　sanの生成
　動きの生成
*/
    console.log(msg)
    io.emit('move', msg);
  });
  socket.on('chat message', (msg) => {
    console.log(msg)
    io.emit('chat message', msg);
  });
});

http.listen(3000);
