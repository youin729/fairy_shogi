

import { anim, render } from './anim';
import * as board from './board';
import { DrawShape } from './draw';
import { cancel as dragCancel } from './drag';
import { State, defaults } from './state';
import * as cg from './types';
import { write as fenWrite } from './fen';
import { setMove, setMultipleMove, setPremove } from './move'

export interface Api {
    // reconfigure the instance. Accepts all config options, except for viewOnly & drawable.visible.
    // board will be animated accordingly, if animations are enabled.
    //set(config: Config): void;
  
    // read chessground state; write at your own risks.
    state: State;
  
    // get the position as a FEN string (only contains pieces, no flags)
    getFen(): cg.FEN;
  
    // change the view angle 盤を反転させる。
    toggleOrientation(): void;

    //setMove
    setMove(): void;

    //setMove
    setMultipleMove(dest: cg.Key): void;
  
    // perform a move programmatically プログラムにしたがって駒を動かす
    move(orig: cg.Key, dest: cg.Key): void;
  
    // add and/or remove arbitrary pieces on the board 任意の駒を盤に追加/取り除く
    setPieces(pieces: cg.Pieces): void;
  
    // click a square programmatically マスを選択したときの動き
    selectSquare(key: cg.Key | null, force?: boolean): void;
  
    // put a new piece on the board 新しい駒を配置する。
    newPiece(piece: cg.Piece, key: cg.Key): void;
  
    // play the current premove, if any; returns true if premove was played　プリムーブ
    playPremove(): boolean;
  
    // cancel the current premove, if any　プリムーブをキャンセル
    cancelPremove(): void;
  
    //setMove
    setPremove(): void;
  
    // cancel the current move being made 待った？
    cancelMove(): void;
  
    // cancel current move and prevent further ones
    stop(): void;

    // programmatically draw user shapes 図形を描く(矢印や〇など)
    setShapes(shapes: DrawShape[]): void;
  
    // programmatically draw auto shapes 図形を描く
    setAutoShapes(shapes: DrawShape[]): void;
  
    // square name at this DOM position (like "e4") domを指定されたとき、座標で返す
    getKeyAtDomPos(pos: cg.NumberPair): cg.Key | undefined;
  
    // only useful when CSS changes the board width/height ratio (for 3D) 盤の大きさを変更したとき、すべてを再描画する。
    redrawAll: cg.Redraw;

    // unbinds all events
    // (important for document-wide events like scroll and mousemove)
    //destroy: cg.Unbind
  }
  
  export function start(state: State, redrawAll: cg.Redraw): Api {
  
    //白番か黒番かを確認する
    function toggleOrientation() {
      board.toggleOrientation(state);
      redrawAll();
    };
  
    return {

      state,
  
      getFen: () => fenWrite(state.pieces),
  
      toggleOrientation,

      setPieces(pieces) {
        anim(state => board.setPieces(state, pieces), state);
      },

      selectSquare(key, force) {
        if (key) anim(state => board.selectSquare(state, key, force), state);
        else if (state.selected) {
          board.unselect(state);
          state.dom.redraw();
        }
      },
  
      move(orig, dest) {
        anim(state => board.baseMove(state, orig, dest), state);
      },

      setMove() {
        state.movable.dests = setMove(state);
      },

      setMultipleMove(dest) {
        state.movable.dests = setMultipleMove(state, dest);
      },

      newPiece(piece, key) {
        anim(state => board.baseNewPiece(state, piece, key), state);
      },

      playPremove() {
        if (state.premovable.current) {
          if (anim(board.playPremove, state)) return true;
          // if the premove couldn't be played, redraw to clear it up
          state.dom.redraw();
        }
        return false;
      },

      cancelPremove() {
        render(board.unsetPremove, state);
      },

      setPremove() {
        state.premovable.dests = setPremove(state);
      },

      cancelMove() {
        render(state => { board.cancelMove(state); dragCancel(state); }, state);
      },
  
      stop() {
        render(state => { board.stop(state); dragCancel(state); }, state);
      },

      setAutoShapes(shapes: DrawShape[]) {
        render(state => state.drawable.autoShapes = shapes, state);
      },
  
      setShapes(shapes: DrawShape[]) {
        render(state => state.drawable.shapes = shapes, state);
      },
  
      getKeyAtDomPos(pos) {
        return board.getKeyAtDomPos(pos, board.whitePov(state), state.dom.bounds());
      },

      redrawAll,
    };
  }
