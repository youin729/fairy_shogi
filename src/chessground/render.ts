
import * as cg from './types'
import { whitePov } from './board'
import * as util from './util'
import { AnimCurrent, AnimVectors, AnimVector, AnimFadings } from './anim'
import { DragCurrent } from './drag'
import { State } from './state'


type PieceName = string;

interface SamePieces { [key: string]: boolean }
interface SameSquares { [key: string]: boolean }
interface MovedPieces { [pieceName: string]: cg.PieceNode[] }
interface MovedSquares { [className: string]: cg.SquareNode[] }
interface SquareClasses { [key: string]: string }

export default function render(s: State): void {
  const asWhite: boolean = whitePov(s),
  posToTranslate = util.posToTranslateAbs(s.dom.bounds()),
  translate = util.translateAbs,
  pieces: cg.Pieces = s.pieces,
  curAnim: AnimCurrent | undefined = s.animation.current,
  anims: AnimVectors = curAnim ? curAnim.plan.anims : {},
  fadings: AnimFadings = curAnim ? curAnim.plan.fadings : {},
  curDrag: DragCurrent | undefined = s.draggable.current,
  samePieces: SamePieces = {},
  sameSquares: SameSquares = {},
  movedPieces: MovedPieces = {},
  movedSquares: MovedSquares = {},
  squares: SquareClasses = computeSquareClasses(s),
  piecesKeys: cg.Key[] = Object.keys(pieces) as cg.Key[];

  let boardEl: HTMLElement = s.dom.elements.board,
  k:cg.Key,
  p: cg.Piece | undefined,
  el: cg.PieceNode | cg.SquareNode,
  pieceAtKey: cg.Piece | undefined,
  elPieceName: PieceName,
  anim: AnimVector | undefined,
  fading: cg.Piece | undefined,
  pMvdset: cg.PieceNode[], //直前に動いたマスの自分版？
  pMvd: cg.PieceNode | undefined, //直前に動いたマス相手版？
  sMvdset: cg.SquareNode[], //現在動いたマスの自分版？
  sMvd: cg.SquareNode | undefined; //現在動いたマスの相手版？

  el = boardEl.firstChild as cg.PieceNode | cg.SquareNode;

  //駒の動きに関するセクション
  while (el) {
    k = el.cgKey;
    if (isPieceNode(el)) {
      pieceAtKey = pieces[k];
      anim = anims[k];
      fading = fadings[k];
      elPieceName = el.cgPiece;
      if (el.cgDragging && (!curDrag || curDrag.orig !== k)) {
        el.classList.remove('dragging');
        translate(el, posToTranslate(util.key2pos(k), asWhite));
        el.cgDragging = false;
      }
      //fadingも同様
      // remove fading class if it still remains
      if (!fading && el.cgFading) {
        el.cgFading = false;
        el.classList.remove('fading');
      }
      // there is now a piece at this dom key
      if (pieceAtKey) {
        // continue animation if already animating and same piece
        // (otherwise it could animate a captured piece)
        if (anim && el.cgAnimating && elPieceName === pieceNameOf(pieceAtKey)) {
          const pos = util.key2pos(k);
          pos[0] += anim[2];
          pos[1] += anim[3];
          el.classList.add('anim');
          translate(el, posToTranslate(pos, asWhite));
        } else if (el.cgAnimating) {
          el.cgAnimating = false;
          el.classList.remove('anim');
          translate(el, posToTranslate(util.key2pos(k), asWhite));
          //if (s.addPieceZIndex) el.style.zIndex = posZIndex(util.key2pos(k), asWhite);
        }
        // same piece: flag as same
        if (elPieceName === pieceNameOf(pieceAtKey) && (!fading || !el.cgFading)) {
          samePieces[k] = true;
        }
        // different piece: flag as moved unless it is a fading piece
        else {
          if (fading && elPieceName === pieceNameOf(fading)) {
            el.classList.add('fading');
            el.cgFading = true;
          } else {
            if (movedPieces[elPieceName]) movedPieces[elPieceName].push(el);
            else movedPieces[elPieceName] = [el];
          }
        }
      }
      // no piece: flag as moved
      else {
        if (movedPieces[elPieceName]) movedPieces[elPieceName].push(el);
        else movedPieces[elPieceName] = [el];
      }
      
    }
    
    else if (isSquareNode(el)) {
      const cn = el.className;
      if (squares[k] === cn) sameSquares[k] = true;
      else if (movedSquares[cn]) movedSquares[cn].push(el);
      else movedSquares[cn] = [el];
    }
    
    el = el.nextSibling as cg.PieceNode | cg.SquareNode;
  }

  // squareノード (lastMoveを示すのに使われる)
  for (const sk in squares) {
    // 同じマスでないことが条件
    if (!sameSquares[sk]) {
      sMvdset = movedSquares[squares[sk]];
      sMvd = sMvdset && sMvdset.pop();
      const translation = posToTranslate(util.key2pos(sk as cg.Key), asWhite);

      //自分の動いたマスであれば、
      if (sMvd) {
        sMvd.cgKey = sk as cg.Key;
        translate(sMvd, translation);
      }
      //そうでなければ、
      else {
        const squareNode = util.createEl('square', squares[sk]) as cg.SquareNode;
        squareNode.cgKey = sk as cg.Key;
        translate(squareNode, translation);
        boardEl.insertBefore(squareNode, boardEl.firstChild);
      }
    }
  }

  for (const j in piecesKeys) {
    k = piecesKeys[j];
    p = pieces[k]!;
    anim = anims[k];
    if (!samePieces[k]) {
      pMvdset = movedPieces[pieceNameOf(p)];
      pMvd = pMvdset && pMvdset.pop();
      // a same piece was moved
      if (pMvd) {
        // apply dom changes
        pMvd.cgKey = k;
        if (pMvd.cgFading) {
          pMvd.classList.remove('fading');
          pMvd.cgFading = false;
        }
        const pos = util.key2pos(k);
        //if (s.addPieceZIndex) pMvd.style.zIndex = posZIndex(pos, asWhite);
        if (anim) {
          pMvd.cgAnimating = true;
          pMvd.classList.add('anim');
          pos[0] += anim[2];
          pos[1] += anim[3];
        }
        translate(pMvd, posToTranslate(pos, asWhite));
      }
      // no piece in moved obj: insert the new piece
      // assumes the new piece is not being dragged
      else {
        const pieceName = pieceNameOf(p),
        pieceNode = util.createEl('piece', pieceName) as cg.PieceNode,
        pos = util.key2pos(k);

        pieceNode.cgPiece = pieceName;
        pieceNode.cgKey = k;
        if (anim) {
          pieceNode.cgAnimating = true;
          pos[0] += anim[2];
          pos[1] += anim[3];
        }
        translate(pieceNode, posToTranslate(pos, asWhite));

        //if (s.addPieceZIndex) pieceNode.style.zIndex = posZIndex(pos, asWhite);

        boardEl.appendChild(pieceNode);
      }
    }
  }
  // remove any element that remains in the moved sets
  //駒を取り除く場合 ？
  for (const i in movedPieces) removeNodes(s, movedPieces[i]);

  //駒を動かした場合？
  for (const i in movedSquares) removeNodes(s, movedSquares[i]);
}

function isPieceNode(el: cg.PieceNode | cg.SquareNode): el is cg.PieceNode {
    return el.tagName === 'PIECE';
}
function isSquareNode(el: cg.PieceNode | cg.SquareNode): el is cg.SquareNode {
  return el.tagName === 'SQUARE';
}

function pieceNameOf(piece: cg.Piece): string {
  return `${piece.color} piece_${piece.role}`;
}

function removeNodes(s: State, nodes: HTMLElement[]): void {
  for (const i in nodes) s.dom.elements.board.removeChild(nodes[i]);
}

function computeSquareClasses(s: State): SquareClasses {
  const squares: SquareClasses = {};
  let i: any, k: cg.Key;
  if (s.lastMove && s.highlight.lastMove) for (i in s.lastMove) {
    addSquare(squares, s.lastMove[i], 'last-move');
  }
  if (s.check && s.highlight.check) addSquare(squares, s.check, 'check');

  if (s.selected) {
    addSquare(squares, s.selected, 'selected');
    if (s.movable.showDests) {
      const dests = s.movable.dests && s.movable.dests[s.selected];
      if (dests) for (i in dests) {
        k = dests[i];
        addSquare(squares, k, 'move-dest' + (s.pieces[k] ? ' oc' : ''));
      }
      const pDests = s.premovable.dests && s.premovable.dests[s.selected];
      if (pDests) for (i in pDests) {
        k = pDests[i];
        addSquare(squares, k, 'premove-dest' + (s.pieces[k] ? ' oc' : ''));
      }
    }
  }
  const premove = s.premovable.current;
  if (premove) for (i in premove) addSquare(squares, premove[i], 'current-premove');
  else if (s.predroppable.current) addSquare(squares, s.predroppable.current.key, 'current-premove');
/*
  const o = s.exploding;
  if (o) for (i in o.keys) addSquare(squares, o.keys[i], 'exploding' + o.stage);
*/
  return squares;
}
function addSquare(squares: SquareClasses, key: cg.Key, klass: string): void {
  if (squares[key]) squares[key] += ' ' + klass;
  else squares[key] = klass;
}
