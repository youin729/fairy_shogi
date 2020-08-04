import * as cg from './types';
import { State } from './state'
import premove from './premove'
import { opposite } from './util'
import { pos2key, key2pos, containsX } from './util'

export type Callback = (...args: any[]) => void;

export function getKeyAtDomPos(pos: cg.NumberPair, asWhite: boolean, bounds: ClientRect): cg.Key | undefined {
    let file = Math.ceil(cg.size * ((pos[0] - bounds.left) / bounds.width));
    if (!asWhite) file = (cg.size + 1) - file;
    let rank = Math.ceil(cg.size - (cg.size * ((pos[1] - bounds.top) / bounds.height)));
    if (!asWhite) rank = (cg.size + 1) - rank;
    return (file > 0 && file <= cg.size && rank > 0 && rank <= cg.size) ? pos2key([file, rank]) : undefined;
}

export function toggleOrientation(state: State): void {
  state.orientation = opposite(state.orientation);
  state.animation.current =
  state.draggable.current =
  state.selected = undefined;
}

export function callUserFunction(f: Callback | undefined, ...args: any[]): void {
    if (f) setTimeout(() => f(...args), 1);
}
export function selectSquare(state: State, key: cg.Key, force?: boolean): void {
    callUserFunction(state.events.select, key);

    if (state.selected) {
      if (state.selected === key && !state.draggable.enabled) {
        unselect(state);
        state.hold.cancel();
        return;
      } else if ((state.selectable.enabled || force) && state.selected !== key) {
        if (userMove(state, state.selected, key)) {
          state.stats.dragged = false;
          return;
        }
      }
    }

    if (isMovable(state, key) || isPremovable(state, key)) {
        setSelected(state, key);
        state.hold.start();
    }
}
export function setSelected(state: State, key: cg.Key): void {
    state.selected = key;
    /*
    if (isPremovable(state, key)) {
      state.premovable.dests = premove(state.pieces, key, state.premovable.castle);
    }
    else state.premovable.dests = undefined;
    */
}

export function baseNewPiece(state: State, piece: cg.Piece, key: cg.Key, force?: boolean): boolean {
  if (state.pieces[key]) {
    if (force) delete state.pieces[key];
    else return false;
  }
  callUserFunction(state.events.dropNewPiece, piece, key);
  state.pieces[key] = piece;
  state.lastMove = [key];
  state.check = undefined;
  callUserFunction(state.events.change);
  state.movable.dests = undefined;
  state.turnColor = opposite(state.turnColor);
  return true;
}

export function playPremove(state: State): boolean {
  const move = state.premovable.current;
  if (!move) return false;
  const orig = move[0], dest = move[1];
  let success = false;
  if (canMove(state, orig, dest)) {
    const result = baseUserMove(state, orig, dest);
    if (result) {
      const metadata: cg.MoveMetadata = { premove: true };
      if (result !== true) metadata.captured = result;
      callUserFunction(state.movable.events.after, orig, dest, metadata);
      success = true;
    }
  }
  unsetPremove(state);
  return success;
}
function isMovable(state: State, orig: cg.Key): boolean {
    const piece = state.pieces[orig];
    return !!piece && (
      state.movable.color === 'both' || (
        state.movable.color === piece.color &&
          state.turnColor === piece.color
      ));
}
function isPremovable(state: State, orig: cg.Key): boolean {
    const piece = state.pieces[orig];
    return !!piece && state.premovable.enabled &&
    state.movable.color === piece.color &&
      state.turnColor !== piece.color;
}
export function unsetPremove(state: State): void {
  if (state.premovable.current) {
    state.premovable.current = undefined;
    callUserFunction(state.premovable.events.unset);
  }
}

export function unselect(state: State): void {
    state.selected = undefined;
    state.premovable.dests = undefined;
    state.hold.cancel();
}


export function baseMove(state: State, orig: cg.Key, dest: cg.Key): cg.Piece | boolean {
    const origPiece = state.pieces[orig], destPiece = state.pieces[dest];
    if (orig === dest || !origPiece) return false;
    const captured = (destPiece && destPiece.color !== origPiece.color) ? destPiece : undefined;
    if (dest == state.selected) unselect(state);
    callUserFunction(state.events.move, orig, dest, captured);

    state.pieces[dest] = origPiece;
    delete state.pieces[orig];

    state.lastMove = [orig, dest];
    state.check = undefined;

    callUserFunction(state.events.change);
    return captured || true;
}
function baseUserMove(state: State, orig: cg.Key, dest: cg.Key): cg.Piece | boolean {
    const result = baseMove(state, orig, dest);
    if (result) {
      state.movable.dests = undefined;
      state.turnColor = opposite(state.turnColor);
      state.animation.current = undefined;
    }
    return result;
}

export function cancelMove(state: State): void {
    unsetPremove(state);
    unsetPredrop(state);
    unselect(state);
}

export function userMove(state: State, orig: cg.Key, dest: cg.Key): boolean {
    if (canMove(state, orig, dest)) {
      const result = baseUserMove(state, orig, dest);
      if (result) {
        const holdTime = state.hold.stop();
        unselect(state);
        const metadata: cg.MoveMetadata = {
          premove: false,
          ctrlKey: state.stats.ctrlKey,
          holdTime
        };
        if (result !== true) metadata.captured = result;
        callUserFunction(state.movable.events.after, orig, dest, metadata);
        return true;
      }
    } else if (canPremove(state, orig, dest)) {
      setPremove(state, orig, dest, {
        ctrlKey: state.stats.ctrlKey
      });
      unselect(state);
      return true;
    }
    unselect(state);
    return false;
}

export function setCheck(state: State, color: cg.Color | boolean): void {
  state.check = undefined;
  if (color === true) color = state.turnColor;
  if (color) for (let k in state.pieces) {
    if (state.pieces[k]!.role === '1' && state.pieces[k]!.color === color) {
      state.check = k as cg.Key;
    }
  }
}

function setPremove(state: State, orig: cg.Key, dest: cg.Key, meta: cg.SetPremoveMetadata): void {
    unsetPredrop(state);
    state.premovable.current = [orig, dest];
    callUserFunction(state.premovable.events.set, orig, dest, meta);
}
export function unsetPredrop(state: State): void {
    const pd = state.predroppable;
    if (pd.current) {
      pd.current = undefined;
      callUserFunction(pd.events.unset);
    }
}

export function isDraggable(state: State, orig: cg.Key): boolean {
    const piece = state.pieces[orig];
    return !!piece && state.draggable.enabled && (
      state.movable.color === 'both' || (
        state.movable.color === piece.color && (
          state.turnColor === piece.color || state.premovable.enabled
        )
      )
    );
}
export function canMove(state: State, orig: cg.Key, dest: cg.Key): boolean {
    return orig !== dest && isMovable(state, orig) && (
        state.movable.free || (!!state.movable.dests && containsX(state.movable.dests[orig], dest))
    );
}

export function stop(state: State): void {
  state.movable.color =
  state.movable.dests =
  state.animation.current = undefined;
  cancelMove(state);
}
function canPremove(state: State, orig: cg.Key, dest: cg.Key): boolean {
    return orig !== dest &&
    isPremovable(state, orig) &&
    containsX(premove(state.pieces, orig, state.premovable.castle), dest);
}
export function whitePov(s: State): boolean {
    return s.orientation === 'white';
}
