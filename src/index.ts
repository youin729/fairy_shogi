
import { Chessground } from './chessground/chessground';
import { Api as CgApi } from './chessground/api';
import * as cg from './chessground/types';
import * as io from "socket.io-client";

import { make as makeSocket, RoundSocket } from './socket';
import * as gi from "./game/interfaces";
import * as game from "./game/game";
import { RoundData, RoundOpts, SocketMove, RoundApi, ApiMove } from "./interfaces";
import * as _ from './common/type';
import * as sound from './sound';

const socket = io();

//////////////////////////////////////////////////

export default class RoundController {
    chessground: CgApi;
    socket: RoundSocket;
    data: RoundData;
    constructor(readonly opts: RoundOpts) {
        this.data = opts.data;
        this.socket = makeSocket(opts.socketSend, this);
    }
    private onUserMove = (orig: cg.Key, dest: cg.Key, meta: cg.MoveMetadata) => {
        this.sendMove(orig, dest, undefined, meta);
        this.chessground.setPremove();
    }

    private onMove = (_: cg.Key, dest: cg.Key, captured?: cg.Piece) => {
        sound.move();
        this.chessground.setMove();
    };
    
    isPlaying = () => game.isPlayerPlaying(this.data);
    sendMove = (orig: cg.Key, dest: cg.Key, prom: cg.Role | undefined, meta: cg.MoveMetadata) => {
        const move: SocketMove = {
          u: orig + dest
        };
        socket.emit('move', move.u);
    };
    makeCgHooks = () => ({
        onUserMove: this.onUserMove,
        onMove: this.onMove,
        /*
        onPremove: this.onPremove,
        */
    });
    setChessground = (cg) => {
        this.chessground = cg;
    }
}


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
    alert("you are player1");
    gd = {
        game: g,
        player: player1,
        opponent: player2,
        takebackable: false,
        moretimeable: false,
    }

} else if(queryObject["p"] == 2) {
    alert("you are player2");
    gd = {
        game: g,
        player: player2,
        opponent: player1,
        takebackable: false,
        moretimeable: false,
    }
}
const rd: RoundOpts = {
    data: gd,
}
//////////////////////////////////////

const ctrl: RoundController = new RoundController(rd);
const hooks = ctrl.makeCgHooks();

const config = {
    orientation: ctrl.data.player.color,
    turnColor: ctrl.data.player.color,
    events: {
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
    if (uci[1] === '@') return [uci.slice(2, 4) as cg.Key];
    return [uci.slice(0, 2), uci.slice(2, 4)] as cg.Key[];
}

socket.on('move', function(msg){
    const keys = uci2move(msg);
    ctrl.chessground.move(keys![0], keys![1]);
});

