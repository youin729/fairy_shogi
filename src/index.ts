
import { Chessground } from './chessground/chessground';
import { Api as CgApi } from './chessground/api';
import { Config } from './chessground/config';
import * as cg from './chessground/types';
import * as io from "socket.io-client";
import { ClockController, ColorMap, ClockElements} from './clock/clockCtrl';

import { make as makeSocket, RoundSocket } from './socket';
import * as gi from "./game/interfaces";
import * as game from "./game/game";
import { RoundData, RoundOpts, SocketMove } from "./interfaces";
import * as _ from './common/type';
import * as sound from './sound';
import * as promotion from './promotion';
import * as multimove from './multimove';
import { CHUSHOGI_PIECES as pieceData } from './pieces';

const socket = io();

let text: string = "";

/////////////////// example data 
const g: gi.Game = {
    id: "game1",
    status: { id:20, name:"started"},
    player: "black",
    turns: 1,
}
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
        steps: [],
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
        steps: [],
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
    socket: RoundSocket;
    data: RoundData;
    ply: number;
    clock?: ClockController;

    constructor(readonly opts: RoundOpts) {
        this.data = opts.data;
        this.socket = makeSocket(opts.socketSend, this);
        this.ply = 1;
        //this.ply = round.lastPly(d);
        console.log(c_el)
        this.clock = new ClockController(this.data, {
            onFlag: () => alert("game set"),//this.socket.outoftime,
            soundColor: this.data.player.spectator ? undefined : this.data.player.color,
            nvui: false,
        }, c_el);
        console.log(this.clock)
    }
    private onUserMove = (orig: cg.Key, dest: cg.Key, meta: cg.MoveMetadata) => {
        promotion.start(this, orig, dest, meta);
        if (!multimove.start(this, orig, dest)){
            this.sendMove(orig, dest, undefined, meta);
            this.chessground.setPremove();
        }
    }

    private onMove = (_: cg.Key, dest: cg.Key, captured?: cg.Piece) => {
        sound.move();
        this.chessground.setMove();
    };
    isPlaying = () => game.isPlayerPlaying(this.data);

    // turn colorを変更する
    set(orig: cg.Key, dest: cg.Key){
        const d = this.data,
        playing = this.isPlaying();
        d.game.turns = this.ply;
        d.game.player = this.ply % 2 === 0 ? 'black' : 'white';

        const playedColor = this.ply % 2 === 0 ? 'white' : 'black',
          activeColor = d.player.color === d.game.player;
        
          /*
        if (r.status) d.game.status = r.status;
        if (r.winner) d.game.winner = r.winner;
*/

        //////// play section ///////////
        this.ply++;
        
        this.chessground.state.turnColor = d.game.player;
        const step = {
            ply: this.ply,
            fen: this.chessground.getFen(),//o.fen,
            san: "", //o.san,
            uci: orig + dest, //o.uci,
            check: false, //o.check,
        };
        text = "現在" + this.ply + "手目で、" + d.game.player + "の手番です。<br>"
        text += "FEN:" + step.fen + "<br>"
        text += "uci：" + step.uci
        document.getElementById("text-test").innerHTML = text;
        d.steps.push(step);

        //時間のインクリメントはサーバー側で管理？
        /*
        const oc = o.clock,
            delay = (playing && activeColor) ? 0 : (oc.lag || 1);
        if (this.clock) this.clock.setClock(d, oc.white, oc.black, delay);
        */
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
        const move: SocketMove = {
          u: orig + dest
        };

        const moveMillis = this.clock.stopClock();
        if (moveMillis !== undefined /*&& this.shouldSendMoveTime*/) {
          //socketOpts.millis = moveMillis;
        }
        alert(moveMillis)
        socket.emit('move', move.u);
        //this.set(orig, dest);
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
    if(uci.charCodeAt(2) < 57){ //isnumber?
        return [uci.slice(0, 3), uci.slice(3)] as cg.Key[];
    } else {
        return [uci.slice(0, 2), uci.slice(2)] as cg.Key[];
    }
}
socket.on('move', function(msg){
    const keys = uci2move(msg);
    ctrl.chessground.move(keys![0], keys![1]);
    ctrl.set(keys![0], keys![1]);
    console.log(ctrl.chessground.state);
});
