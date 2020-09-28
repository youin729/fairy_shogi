const express = require('express')
const crypto = require('crypto')
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const http = require('http').Server(app);
const io = require('socket.io')(http);

const mail = require('./app/mail.js');

/////////////////////////////////////////////
const mysql = require('./app/mysql.js');
mysql.connect();

app.set('view engine', 'pug');

/////////////////////////////////////////////
var DEF_URL = "http://localhost:3000/";

/////////////////////////////////////////////
// routing
app.get('/', function(req, res){
  res.render('index', { game: 'Hhageello' });
});

app.get('/lobby', function(req, res){
  res.render('lobby');
});

app.get('/signin', function(req, res){
  res.render('signin');
});

app.post('/signin', function(req, res){
  console.log(req.body)
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
  let pre_user = req.body
  pre_user.code = makeRandStr();
  mysql.insert('pre_users', pre_user);

  const message = {
    to: pre_user.email,
    subject: '【ALTShogi】仮会員登録確認',
    text: "こんにちは、" + pre_user.name + "さん\nALTShogiの利用を始めるには、下記のリンクから本会員登録に進んでください。\n\n" + DEF_URL + "signup/" + pre_user.code,
  }

  mail.send(message)
  res.render('signup-result');
});

app.get('/signup/:code([a-zA-Z0-9]{16})', function(req, res){
  //console.log(req.params.code)
  res.render('signup-result');
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

app.get('/test', function(req, res){
  //mail.mailSend();
  mysql.mysqlConnect();
  res.render('index', { game: 'Hhageello' });
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
  socket.on('chat', (msg) => {
    console.log(msg)
    io.emit('chat', msg);
  });
});

http.listen(process.env.PORT || 3000);

//任意桁のランダム文字列を作成
function makeRandStr(n) {
  if(!n) n=16
  const s="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from(crypto.randomFillSync(new Uint8Array(n))).map((n)=>s[n%s.length]).join('')
}



