
import * as cg from './chessground/types';
import RoundController from './index';
import { CHUSHOGI_SECOND_MOVES as moveData } from './pieces';


interface Promoting {
    move: [cg.Key, cg.Key];
    pre: boolean;
    meta: cg.MoveMetadata
}
  
let promoting: Promoting | undefined;

export function start(ctrl: RoundController, orig: cg.Key, dest: cg.Key): boolean {
    const piece = ctrl.chessground.state.pieces[dest];
    
    if (moveData[piece.role] && ctrl.chessground.state.multimove === false){
      const diff_x = Math.abs(orig.charCodeAt(0) - dest.charCodeAt(0)),
      diff_y = Math.abs(parseInt(orig.substr(1)) - parseInt(dest.substr(1)));

      //diff_y が絶対値だと判定できない
      if(diff_x <= 1 && diff_y <= 1){
        ctrl.chessground.state.multimove = true;
        ctrl.chessground.setMultipleMove(dest);
        ctrl.multimove_uci = orig + dest;
        return true;
      }
    }
    ctrl.chessground.state.multimove = false;
    return false;
}
