const express = require('express')
const crypto = require('crypto')
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const http = require('http').Server(app);
const io = require('socket.io')(http); 

const mail = require('./app/mail.js');

/////////////////////////////////////////////
// database
const app_mysql = require('./app/mysql.js');
app_mysql.connect();

/////////////////////////////////////////////
// session
const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie:
    {
      httpOnly: true,
      secure: false,
      maxage: 1000 * 60 * 30
    }
}));

app.set('view engine', 'pug');

/////////////////////////////////////////////
var DEF_URL = "http://localhost:3000/";

/////////////////////////////////////////////
// routing
app.get('/', function(req, res){
  const my_session = {
    my_id: req.session.userid,
    my_name: req.session.username,
  }
  res.render('lobby', my_session);
});

app.get('/error', function(req, res){
  res.render('error');
});

app.get('/signin', function(req, res){
  res.render('signin');
});

app.post('/signin', function(req, res){
  const cond = {
    password: req.body.password,
  }
  const raw = " AND email LIKE '"+ req.body.name +"' OR name LIKE '"+ req.body.name +"' LIMIT 1";

  app_mysql.select(`users`, cond, raw, function(result){
    if(!result[0]){
      res.redirect('/error');
    } else {
      req.session.userid = result[0].id;
      req.session.username = result[0].name;
      res.redirect('/');
    }
  })
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
  let pre_user = req.body
  pre_user.code = makeRandStr();
  app_mysql.insert('pre_users', pre_user);

  const message = {
    to: pre_user.email,
    subject: '【ALTShogi】仮会員登録確認',
    text: "こんにちは、" + pre_user.name + "さん\nALTShogiの利用を始めるには、下記のリンクから本会員登録に進んでください。\n\n" + DEF_URL + "signup/" + pre_user.code,
  }
  mail.send(message)
  res.render('signup-result');
});

app.get('/signup/:code([a-zA-Z0-9]{16})', function(req, res){
  const cond = {
    code: req.params.code,
  }
  const raw = '' //'AND created_at >= (CURRENT_TIMESTAMP - INTERVAL 1 HOUR) LIMIT 1';
  
  app_mysql.select(`pre_users`, cond, raw, function(result){
    if(!result[0]){
      res.redirect('/error');
    } else {
      // todo. 本会員登録処理
      // todo. 文字列暗号化
      res.render('signup-result');
    }
  })
});

/////////////////////////////////////////////
// game routing

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

//public
app.use('/public', express.static('public'));
app.use('/dist', express.static('dist'));

/////////////////////////////////////////////
// socket
const userHash = {};

const chatNS = io.of('/lobby');
chatNS.on("connection", function(socket){

	var roomName = "default";
	socket.join(roomName);

	socket.on("connected", function(name){
		var msg = name + "が入室しました";
    userHash[socket.id] = name;
    //console.log(msg)
		chatNS.to(roomName).emit("pushlish", {value: msg});
	});

  //メッセージ送信
	socket.on("chat", function(data){
    console.log(data)
		chatNS.to(roomName).emit("chat", data);
	});

  //ゲーム作成
	socket.on("create", function(data){
    console.log(data)
    const pre_game = {
      hash: makeRandStr(12),
      initial: data.initial,
      increment: data.timerule == "increment" ? data.increment : null,
      countdown: data.timerule == "countdown" ? data.countdown : null,
      tackbackable: false,
      moretimeable: false,
    }
    if(data.color == "black"){
      pre_game.black_user_id = data.userId,
      pre_game.black_user_name = data.userName
    } else if(data.color == "white"){
      pre_game.white_user_id = data.userId,
      pre_game.white_user_name = data.userName
    } else {
      //todo. あとでランダムにする。
      pre_game.black_user_id = data.userId,
      pre_game.black_user_name = data.userName
    }

    app_mysql.insert('pre_games', pre_game);
  
		//chatNS.to(roomName).emit("chat", data);
  });
  
	// 接続終了組み込みイベント
	socket.on("disconnect", function(){
		if(userHash[socket.id]){
			var msg = userHash[socket.id] + "が退出しました";
			delete userHash[socket.id];
			chatNS.to(roomName).emit("publish", {value: msg});
		}
	});
});

const gameNS = io.of('/game');
gameNS.on('connection', (socket) => {
  socket.on('move', (msg) => {
    msg.ply ++;
    console.log(msg)
    gameNS.emit('move', msg);
  });
});

/////////////////////////////////////////////
//任意桁のランダム文字列を作成
function makeRandStr(n) {
  if(!n) n=16
  const s="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from(crypto.randomFillSync(new Uint8Array(n))).map((n)=>s[n%s.length]).join('')
}


http.listen(process.env.PORT || 3000);


