import * as util from './util'
import * as cg from './types'
import { State } from './state';

/**
   * function move
   * 現局面(pieces、マスの座標から、移動先をcg.Key型の配列で返します。
   * {key:"a2" => cg.Pos:["a3", "a4"]}
   * 
*/
function legalMove(state: State, key: cg.Key, premove?: boolean, multiple?:boolean): cg.Key[]{
  
  //return
  let pos2: cg.Key[] = new Array();

  if(!state.pieceInfos){
    return pos2;
  }

  const piece = state.pieces[key]!,
  pos = util.key2pos(key),
  x:number = pos[0],
  y:number = pos[1];

  let dx: number[]; //横の変化量
  let dy: number[]; //縦の変化量
  let xx: number; //移動先の座標x
  let yy: number; //移動先の座標y

  if(multiple){
    // 歩く動き
    if(state.pieceInfos[piece.role]["second_step"]){
      dx = state.pieceInfos[piece.role]["second_step"][0];
      dy = state.pieceInfos[piece.role]["second_step"][1];
      for(let i = 0; i < dx.length; i++){
          xx = (piece.color === "black" ? x - dx[i] : x + dx[i]);
          yy = (piece.color === "black" ? y - dy[i] : y + dy[i]);
          
          //盤の範囲
          if(0 < xx && xx <= cg.size && 0 < yy && yy <= cg.size){
              let dest_key = util.pos2key([xx, yy]);
              let target_piece = state.pieces[dest_key];
              //味方の駒でなければ
              if(!premove && (!target_piece || target_piece.color !== piece.color)){
                pos2.push(dest_key);
              }
          }
      }
    }
  } else {
    // 歩く動き
    if(state.pieceInfos[piece.role]["step"]){
      dx = state.pieceInfos[piece.role]["step"][0];
      dy = state.pieceInfos[piece.role]["step"][1];
      for(let i = 0; i < dx.length; i++){
          xx = (piece.color === "black" ? x - dx[i] : x + dx[i]);
          yy = (piece.color === "black" ? y - dy[i] : y + dy[i]);
          
          //盤の範囲
          if(0 < xx && xx <= cg.size && 0 < yy && yy <= cg.size){
              let dest_key = util.pos2key([xx, yy]);
              let target_piece = state.pieces[dest_key];
              //味方の駒でなければ
              if(!premove && (!target_piece || target_piece.color !== piece.color)){
                pos2.push(dest_key);
              }
          }
      }
    }

    // 走る動き
    if(state.pieceInfos[piece.role]["run"]){
        dx = state.pieceInfos[piece.role]["run"][0];
        dy = state.pieceInfos[piece.role]["run"][1];
        for(let i = 0; i < dx.length; ++i){
            xx = x - dx[i];
            yy = piece.color === "black" ? y - dy[i] : y + dy[i];

            //盤の端まで繰り返す
            while(0 < xx && xx <= cg.size && 0 < yy && yy <= cg.size){
              let dest_key = util.pos2key([xx, yy]);
              let target_piece = state.pieces[dest_key];
              if(!premove && dest_key){
                //味方の駒が射線上にある時
                if(target_piece){
                  if(target_piece.color !== piece.color){
                    pos2.push(dest_key);
                    break;
                  } else if(target_piece.color === piece.color){
                    break;
                  }
                } else {
                  pos2.push(dest_key);
                }
              }
              xx -= dx[i];
              yy = piece.color === "black" ? yy - dy[i] : yy + dy[i];
            }
        }
    }
  }
  return pos2;
}

export function setMove(state: State): cg.Dests {
  let dests = {};
  for(const c of util.allKeys){
    if(state.pieces[c] && (state.movable.color === "both" || state.pieces[c].color === state.orientation)){
      dests[c] = legalMove(state, c);
    }
  }
  return dests;
}

export function setMultipleMove(state: State, dest:cg.Key): cg.Dests {
  let dests = {};
  if(!state.multimove){
    return;
  }
  for(const c of util.allKeys){
    if(c == dest){
      if(state.pieces[c] && (state.movable.color === "both" || state.pieces[c].color === state.orientation)){
        dests[c] = legalMove(state, c, false, true);
      }
    }
  }
  return dests;
}

export function setPremove(state: State): cg.Dests {
  let dests = {};
  for(const c of util.allKeys){
    if(state.pieces[c] && (state.movable.color === "both" || state.pieces[c].color === state.orientation)){
      dests[c] = legalMove(state, c, true);
    }
  }
  return dests;
}
