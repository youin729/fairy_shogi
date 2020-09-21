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

//ゲームの黒番、白番が使用する。
app.get('/:gameId([a-zA-Z0-9]{12})', function(req, res){
  const game = {
    id: req.params.gameId.substr(0, 8),
    status: { id:20, name:"started"},
    player: "black",
    turns: 1,
  }
  const initialFen = '[-3][-11][-10][-5][-6][-13][-1][-6][-5][-10][-11][-3]/[-16]1[-7]1[-12][-14][-15][-12]1[-7]1[-16]/[-17][-18][-8][-19][-20][-21][-22][-20][-19][-8][-18][-17]/[-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2]/3[-9]4[-9]3/12/12/3[9]4[9]3/[2][2][2][2][2][2][2][2][2][2][2][2]/[17][18][8][19][20][22][21][20][19][8][18][17]/[16]1[7]1[12][15][14][12]1[7]1[16]/[3][11][10][5][6][1][13][6][5][10][11][3] b - 1'
  res.render('index', {game:JSON.stringify(game), initialFen:initialFen});
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
　plyの管理 (インクリメント) ⇒ 済？
　時間の管理 (increment?) ⇒ 済？
　fenの生成
　sanの生成
　動きの生成
*/  
    msg.ply ++;
    console.log(msg)
    io.emit('move', msg);
  });
  socket.on('chat message', (msg) => {
    console.log(msg)
    io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT || 3000);
