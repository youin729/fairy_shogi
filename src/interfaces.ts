import { GameData, Status } from './game/interfaces';
import { ClockData } from './clock/clockCtrl';
import * as _ from './common/type';
import * as cg from './chessground/types';

///////////////////// intrefaces //////////////////////
export interface RoundApi {
  chessground,
}
export interface RoundData extends GameData {
  clock?: ClockData;
  steps: Step[];
}
export interface RoundOpts {
    data: RoundData;
    userId?: string;
    socketSend?: _.SocketSend;
}
export interface SocketMove {
    u: _.Uci;
    b?: 1;
}

export interface SocketOpts {
  ackable: boolean;
  withLag?: boolean;
  millis?: number | void;
}


export interface Untyped {
  [key: string]: any;
}

type Seconds = number;
type Centis = number;
type Millis = number;

export type EncodedDests = string | {
    [key: string]: string;
};
export interface DecodedDests {
    [key: string]: cg.Key[];
}

export interface Step {
  ply: _.Ply;
  fen: _.Fen;
  san: _.San;
  uci: _.Uci;
  check?: boolean;
}

export interface ApiMove extends Step {
    dests: EncodedDests;
    clock?: {
      white: Seconds;
      black: Seconds;
      lag?: Centis;
    }
    status: Status;
    winner?: _.Color;
    check: boolean;
    threefold: boolean;
    wDraw: boolean;
    bDraw: boolean;
    role?: cg.Role;
    drops?: string;
    promotion?: {
      key: cg.Key;
      pieceClass: cg.Role;
    };
    enpassant: {
      key: cg.Key;
      color: _.Color;
    };
    castle: {
      king: [cg.Key, cg.Key];
      rook: [cg.Key, cg.Key];
      color: _.Color;
    };
    isMove?: true;
    isDrop?: true;

    opts: any;
}

export type Position = 'top' | 'bottom';
  
export interface ApiEnd {
  winner?: _.Color;
  status: Status;
  ratingDiff?: {
    white: number;
    black: number;
  };
  boosted: boolean;
  clock?: {
    wc: Centis;
    bc: Centis;
  }
}


