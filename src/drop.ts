import * as cg from './types';
import * as util from './util';
import { State } from './state'

//new pieceを配置する？
export function drop(s: State, e: cg.MouchEvent): void {
    if (!s.dropmode.active) return;
  
    // premove 
    //board.unsetPremove(s);
    //board.unsetPredrop(s);
  
    const piece = s.dropmode.piece;
    if (piece) {
      s.pieces.a0 = piece;
      const position = util.eventPosition(e);
      /*
      const dest = position && board.getKeyAtDomPos(
        position, board.whitePov(s), s.dom.bounds());
      if (dest) board.dropNewPiece(s, 'a0', dest);
      */
    }
    s.dom.redraw();
}
