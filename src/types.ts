/////////////////////////////////////
// board settings
/////////////////////////////////////
export type Size = number;
export const size: Size = 12;

export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const files: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
export const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export type Key = 'a0' | 'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1' | 'i1' | 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' | 'i2' |'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' | 'i3' |'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' | 'i4' | 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' | 'i5' | 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' | 'i6' | 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' | 'i7' | 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' | 'i8' ;

/*
export const size: Size = 8;

export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' ;
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 ;

export const files: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8];
export type Key = 'a0' | 'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1' | 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' | 'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' | 'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' | 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' | 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' | 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' | 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' ;
*/
/*
export const size: Size = 9;

export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ;

export const files: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
export const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export type Key = 'a0' | 'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1' | 'i1' | 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' | 'i2' |'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' | 'i3' |'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' | 'i4' | 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' | 'i5' | 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' | 'i6' | 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' | 'i7' | 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' | 'i8' ;
*/

/*
export const size: Size = 12;

export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const files: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
export const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export type Key = 'a0' | 'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1' | 'i1' | 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' | 'i2' |'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' | 'i3' |'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' | 'i4' | 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' | 'i5' | 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' | 'i6' | 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' | 'i7' | 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' | 'i8' ;
*/


/////////////////////////////////////
//pieces
/////////////////////////////////////
//export type Role = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export type Role = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21';

export type Color = 'white' | 'black';
export interface Piece {
    role: Role;
    color: Color;
    promoted?: boolean;
 }
export interface Pieces {
    [key: string]: Piece | undefined;
}

export type Pos = [number, number];
export type FEN = string;
export type KeyPair = [Key, Key];
export type NumberPair = [number, number];
export type NumberQuad = [number, number, number, number];
export type Milliseconds = number;
export type KHz = number;

/////////////////////////////////////
// Elements, Func
/////////////////////////////////////
export interface Elements {
    board: HTMLElement;
    container: HTMLElement;
    ghost?: HTMLElement;
    svg?: SVGElement;
}
export interface Dom {
    elements: Elements;
    bounds: Memo<ClientRect>;
    redraw: () => void;
    redrawNow: (skipSvg?: boolean) => void;
    unbind?: Unbind;
    destroyed?: boolean;
    relative?: boolean; // don't compute bounds, use relative % to place pieces
}
export interface Timer {
    start: () => void;
    cancel: () => void;
    stop: () => number;
}
export interface KeyedNode extends HTMLElement {
    cgKey: Key;
}
export interface PieceNode extends KeyedNode {
    cgPiece: string;
    cgAnimating?: boolean;
    cgFading?: boolean;
    cgDragging?: boolean;
}
export interface SquareNode extends KeyedNode { }

export interface Memo<A> { (): A; clear: () => void; }

/////////////////////////////////////
// events
/////////////////////////////////////
export type MouchEvent = MouseEvent & TouchEvent;

export interface Dests {
    [key: string]: Key[]
}
export interface MoveMetadata {
    premove: boolean;
    ctrlKey?: boolean;
    holdTime?: number;
    captured?: Piece;
    predrop?: boolean;
}
export interface SetPremoveMetadata {
    ctrlKey?: boolean;
}
export type Redraw = () => void;
export type Unbind = () => void;
