
import { Chessground } from './chessground/chessground';
import { Api as CgApi } from './chessground/api';
import { Config } from './chessground/config';
import * as cg from './chessground/types';
import * as io from "socket.io-client";
import { ClockController, ColorMap, ClockElements} from './clock/clockCtrl';

import { make as makeSocket, RoundSocket } from './socket';
import * as gi from "./game/interfaces";
import * as game from "./game/game";
import { RoundData, RoundOpts, SocketMove, SocketOpts, Step, ApiMove } from "./interfaces";
import * as _ from './common/type';
import * as sound from './sound';
import * as promotion from './promotion';
import * as multimove from './multimove';
import { CHUSHOGI_PIECES as pieceData } from './pieces';

declare var gameData: gi.Game;
declare var initialFen: string;

const socket = io('/game');

let text: string = "";

/////////////////// example data 
var g: gi.Game = gameData //変更される値

const player1: gi.Player = {
    id: "player1",
    name: "プレイヤー1",
    color: "black",
}
const player2: gi.Player = {
    id: "player2",
    name: "プレイヤー2",
    color: "white",
}

var queryString = window.location.search;
var queryObject = new Object();
if(queryString){
    queryString = queryString.substring(1);
    var parameters = queryString.split('&');

    for (var i = 0; i < parameters.length; i++) {
    var element = parameters[i].split('=');

    var paramName = decodeURIComponent(element[0]);
    var paramValue = decodeURIComponent(element[1]);

    queryObject[paramName] = paramValue;
    }
}
let gd: RoundData;

if(queryObject["p"] == 1){
    gd = {
        game: g,
        clock: { 
            running: true,
            initial: 1200,
            increment: 5,
            white: 1200,
            black: 1200,
            emerg: 200,
            showTenths:1,
            moretime: 15
        },
        steps: [{"ply":0,"uci":null,"san":null,"fen":'[-3][-11][-10][-5][-6][-13][-1][-6][-5][-10][-11][-3]/[-16]1[-7]1[-12][-14][-15][-12]1[-7]1[-16]/[-17][-18][-8][-19][-20][-21][-22][-20][-19][-8][-18][-17]/[-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2]/3[-9]4[-9]3/12/12/3[9]4[9]3/[2][2][2][2][2][2][2][2][2][2][2][2]/[17][18][8][19][20][22][21][20][19][8][18][17]/[16]1[7]1[12][15][14][12]1[7]1[16]/[3][11][10][5][6][1][13][6][5][10][11][3] b - 1'}],
        player: player1,
        opponent: player2,
        takebackable: false,
        moretimeable: false,
    }

} else if(queryObject["p"] == 2) {
    gd = {
        game: g,
        clock: { 
            running: true,
            initial: 1200,
            increment: 5,
            white: 1200,
            black: 1200,
            emerg: 200,
            showTenths:1,
            moretime: 15
        },
        steps: [{"ply":0,"uci":null,"san":null,"fen":'[-3][-11][-10][-5][-6][-13][-1][-6][-5][-10][-11][-3]/[-16]1[-7]1[-12][-14][-15][-12]1[-7]1[-16]/[-17][-18][-8][-19][-20][-21][-22][-20][-19][-8][-18][-17]/[-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2]/3[-9]4[-9]3/12/12/3[9]4[9]3/[2][2][2][2][2][2][2][2][2][2][2][2]/[17][18][8][19][20][22][21][20][19][8][18][17]/[16]1[7]1[12][15][14][12]1[7]1[16]/[3][11][10][5][6][1][13][6][5][10][11][3] b - 1'}],
        player: player2,
        opponent: player1,
        takebackable: false,
        moretimeable: false,
    }
}

const rd: RoundOpts = {
    data: gd,
}

const c_el: ColorMap<ClockElements> = {
    white : {time: document.getElementById("rclock-" + (gd.player.color === "white" ? "bottom" : "top"))},
    black: {time: document.getElementById("rclock-" + (gd.player.color === "black" ? "bottom" : "top"))}
}
//////////////////////////////////////////////////

export default class RoundController {
    chessground: CgApi;
    data: RoundData;
    ply: number;
    multimove_uci: string;
    clock?: ClockController;

    constructor(readonly opts: RoundOpts) {
        this.data = opts.data;
        this.ply = this.lastPly(this.data);
        this.clock = new ClockController(this.data, {
            onFlag: () => alert("game set"),//this.socket.outoftime,
            soundColor: this.data.player.spectator ? undefined : this.data.player.color,
            nvui: false,
        }, c_el);
    }

    private onUserMove = (orig: cg.Key, dest: cg.Key, meta: cg.MoveMetadata) => {
        promotion.start(this, orig, dest, meta);

        if (!multimove.start(this, orig, dest)){
            this.sendMove(orig, dest, undefined, meta);
            //this.chessground.setPremove();
        }
    }

    private onMove = (_: cg.Key, dest: cg.Key, captured?: cg.Piece) => {
        sound.move();
    };

    isPlaying = () => game.isPlayerPlaying(this.data);
    replaying = (): boolean => this.ply !== this.lastPly(this.data);

    lastPly(d: RoundData): number {
        return this.lastStep(d).ply;
    }
      
    lastStep(d: RoundData): Step {
        return d.steps[d.steps.length - 1];
    }

    //自分が動くとき、相手が動く時、どちらもに動作する
    apiMove(o: ApiMove){

        const d = this.data, playing = this.isPlaying();

        //ply はturn数をあらわす
        d.game.turns = o.ply;
        d.game.player = o.ply % 2 === 0 ? 'white' : 'black';
        const playedColor = o.ply % 2 === 0 ? 'black' : 'white',
        activeColor = d.player.color === d.game.player; //現在の手番かどうか
        if (o.status) d.game.status = o.status; //ステータス更新
        if (o.winner) d.game.winner = o.winner;

        //d.possibleMoves = activeColor ? o.dests : undefined; //自分の可能な移動先は、相手から送られてきたデータの中にある。
        //逆に自分のpremoveは送った時に作ればいい？

        //時間処理
        if(o.opts.millis){
            const second = o.opts.millis / 1000;
            if(d.game.player == 'white'){
                this.data.clock.white = this.data.clock.white - second
            } else if(d.game.player == 'black'){
                this.data.clock.black = this.data.clock.black - second
            }
            /* else {
                if(d.game.player == 'white'){
                    this.data.clock.black = this.data.clock.black - second
                    alert(this.data.clock.black)
                } else if(d.game.player == 'black'){
                    this.data.clock.white = this.data.clock.white - second
                    alert(this.data.clock.white)
                }
            }
            */
        }

        console.log(this.data.clock)



        if (!this.replaying()) {
            this.ply++; //手番を更新
            if(checkUciMulti(o.uci)){
                //2手移動の1手目を動かす
                const keys = uci2move(o.uci);
                this.chessground.move(keys![0], keys![1]); //駒を動かす
            }
            const keys = uci2move(o.uci);
            this.chessground.move(keys![0], keys![1]); //駒を動かす
        }
        if(this.isPlaying){
            this.chessground.setMove();
        }
        this.chessground.set({
            turnColor: d.game.player,
            //check: !!o.check
        });
        //if (o.check) sound.check();

        //データに移動情報を入れる
        const step = {
            ply: this.ply,
            fen: this.chessground.getFen(),//o.fen,
            san: "", //o.san,
            uci: o.uci, //o.uci,
            check: false, //o.check,
        };

        text = "現在" + this.ply + "手目で、" + d.game.player + "の手番です。<br>"
        text += "FEN:" + step.fen + "<br>"
        text += "uci：" + step.uci + "<br>"
        text += "time(mill)" + o.opts.millis
        document.getElementById("text-test").innerHTML = text;
        d.steps.push(step);

        //時間を更新
        if (this.data.clock) {
            /*
            this.shouldSendMoveTime = true;
            */
            const oc = this.data.clock;
            const delay = 0;
            //    delay = (playing && activeColor) ? 0 : (oc.lag || 1);
            this.clock.setClock(d, oc.white, oc.black, delay);
        }
    }

    sendPromotion = (orig: cg.Key, dest: cg.Key, role: cg.Role, meta: cg.MoveMetadata): boolean => {
        const piece = this.chessground.state.pieces[dest];
        if (piece) {
          const pieces: cg.Pieces = {};
          pieces[dest] = {
            color: piece.color,
            role,
            promoted: true
          };
          this.chessground.setPieces(pieces);
        }
        ctrl.sendMove(orig, dest, role, meta);
        return true;
    }

    sendMove = (orig: cg.Key, dest: cg.Key, prom: cg.Role | undefined, meta: cg.MoveMetadata) => {

        let uci: string = "";
        if(this.multimove_uci){
            uci = this.multimove_uci + dest;
            this.multimove_uci = "";
        } else {
            uci = orig + dest;
        }
        const ply: number = this.data.game.turns;
        const opts: SocketOpts = {
            ackable: true
        };

        const moveMillis = this.clock.stopClock();
        if (moveMillis !== undefined /*&& this.shouldSendMoveTime*/) {
            opts.millis = moveMillis;
        }

        const sendData = {uci, ply, opts}
        socket.emit('move', sendData);
    };
    
    makeCgHooks = () => ({
        onUserMove: this.onUserMove,
        onMove: this.onMove,
    });
    setChessground = (cg) => {
        this.chessground = cg;
    }
}

//////////////////////////////////////

const ctrl: RoundController = new RoundController(rd);
const hooks = ctrl.makeCgHooks();

const config: Config = {
    fen: initialFen,
    orientation: ctrl.data ? ctrl.data.player.color : "black",
    turnColor: ctrl.data ? ctrl.data.player.color : "black",
    pieceInfos: pieceData,
    events: {
        //move: ctrl.userMove,
        move: hooks.onMove,
    },
    movable: {
        free: false,
        color: ctrl.isPlaying() ? ctrl.data.player.color : undefined,
        /*
        dests: playing ? util.parsePossibleMoves(data.possibleMoves) : {},
        showDests: data.pref.destination,
        */
        events: {
            after: hooks.onUserMove
        }
    },
}
ctrl.setChessground(Chessground(document.getElementById("app"), config))

export function uci2move(uci: string): cg.Key[] | undefined {
    if (!uci) return undefined;
    //if (uci[1] === '@') return [uci.slice(2, 4) as cg.Key];

    //1手移動の場合
    if(uci.charCodeAt(2) < 58){ //2文字目が数字の場合：移動元はc10などの符号
        return [uci.slice(0, 3), uci.slice(3)] as cg.Key[];
    } else {
        return [uci.slice(0, 2), uci.slice(2)] as cg.Key[];
    }

}

//2手移動かどうかをチェックする。
//uciが6文字以下であることかつ、4文字目が数字でなければ、1手移動。
export function checkUciMulti(uci: string): boolean {
    if(uci.length <= 6 || !(uci.charCodeAt(2) < 58)){
        return false;
    } else {
        return true;
    }
}

// 手を送信したときにも、receiveする。
// したがって、送信時、受信時に動作し、引数のoはサーバー側で管理される。
socket.on('move', function(o){
    console.log(o)
    ctrl.apiMove(o);
});
