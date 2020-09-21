
import * as cg from './chessground/types';
import { key2pos } from './chessground/util';
//import { bind } from './index';
import RoundController from './index';
import { CHUSHOGI_PIECES as pieceData } from './pieces';


interface Promoting {
    move: [cg.Key, cg.Key];
    pre: boolean;
    meta: cg.MoveMetadata
}
  
let promoting: Promoting | undefined;

export function start(ctrl: RoundController, orig: cg.Key, dest: cg.Key, meta: cg.MoveMetadata = {} as cg.MoveMetadata): boolean {
    const d = ctrl.data,
      piece = ctrl.chessground.state.pieces[dest],
      premovePiece = ctrl.chessground.state.pieces[orig];
    
    
    if ((((piece && !premovePiece) || premovePiece) && pieceData[piece.role].promote) && (
      (parseInt(dest.substr(1)) >= 9 && d.player.color === 'white') || (parseInt(dest.substr(1)) <= 4 && d.player.color === 'black'))) {

      if(confirm("成りますか？")){
        return ctrl.sendPromotion(orig, dest, pieceData[piece.role].promote, meta);
      }
      promoting = {
        move: [orig, dest],
        pre: !!premovePiece,
        meta
      };
      //ctrl.redraw();
      return true;
    }
  
    //return false;
}

/*
function renderPromotion(ctrl: RoundController, dest: cg.Key, color: cg.Color, orientation:　cg.Color) {
  var left = (8 - key2pos(dest)[0]) * 12.5;
  if (orientation === 'white') left = 87.5 - left;
  var vertical = color === orientation ? 'top' : 'bottom';
  /*
  return h('div#promotion-choice.' + vertical, {
    hook: onInsert(el => {
      el.addEventListener('click', () => cancel(ctrl));
      el.addEventListener('contextmenu', e => {
        e.preventDefault();
        return false;
      });
    })
  }, roles.map((serverRole, i) => {
    var top = (color === orientation ? i : 7 - i) * 12.5;
    return h('square', {
      attrs: {style: 'top: ' + top + '%;left: ' + left + '%'},
      hook: bind('click', e => {
        e.stopPropagation();
        finish(ctrl, serverRole);
      })
    }, [
      h('piece.' + serverRole + '.' + color)
    ]);
  }));

};
*/
export function view(ctrl: RoundController) {
  if (!promoting) return;
  //return renderPromotion(ctrl, promoting.move[1], ctrl.data.player.color, ctrl.chessground.state.orientation);
};
