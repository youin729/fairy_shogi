/////////////////////////////////////
// board settings
/////////////////////////////////////
export type Size = number;

export const size: Size = 12;
export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const files: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
export const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export type Key = 'a0' |
 'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1' | 'i1' | 'j1' | 'k1' | 'l1' |
 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' | 'i2' | 'j2' | 'k2' | 'l2' |
 'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' | 'i3' | 'j3' | 'k3' | 'l3' |
 'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' | 'i4' | 'j4' | 'k4' | 'l4' |
 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' | 'i5' | 'j5' | 'k5' | 'l5' |
 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' | 'i6' | 'j6' | 'k6' | 'l6' |
 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' | 'i7' | 'j7' | 'k7' | 'l7' |
 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' | 'i8' | 'j8' | 'k8' | 'l8' |
 'a9' | 'b9' | 'c9' | 'd9' | 'e9' | 'f9' | 'g9' | 'h9' | 'i9' | 'j9' | 'k9' | 'l9' |
 'a10' | 'b10' | 'c10' | 'd10' | 'e10' | 'f10' | 'g10' | 'h10' | 'i10' | 'j10' | 'k10' | 'l10' |
 'a11' | 'b11' | 'c11' | 'd11' | 'e11' | 'f11' | 'g11' | 'h11' | 'i11' | 'j11' | 'k11' | 'l11' |
 'a12' | 'b12' | 'c12' | 'd12' | 'e12' | 'f12' | 'g12' | 'h12' | 'i12' | 'j12' | 'k12' | 'l12' ;
/*
export const size: Size = 16;
export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

export const files: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
export const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

 export type Key = 'a0' |
 'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1' | 'i1' | 'j1' | 'k1' | 'l1' | 'm1' | 'n1' | 'o1' | 'p1' |
 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' | 'i2' | 'j2' | 'k2' | 'l2' | 'm2' | 'n2' | 'o2' | 'p2' |
 'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' | 'i3' | 'j3' | 'k3' | 'l3' | 'm3' | 'n3' | 'o3' | 'p3' |
 'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' | 'i4' | 'j4' | 'k4' | 'l4' | 'm4' | 'n4' | 'o4' | 'p4' |
 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' | 'i5' | 'j5' | 'k5' | 'l5' | 'm5' | 'n5' | 'o5' | 'p5' |
 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' | 'i6' | 'j6' | 'k6' | 'l6' | 'm6' | 'n6' | 'o6' | 'p6' |
 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' | 'i7' | 'j7' | 'k7' | 'l7' | 'm7' | 'n7' | 'o7' | 'p7' |
 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' | 'i8' | 'j8' | 'k8' | 'l8' | 'm8' | 'n8' | 'o8' | 'p8' |
 'a9' | 'b9' | 'c9' | 'd9' | 'e9' | 'f9' | 'g9' | 'h9' | 'i9' | 'j9' | 'k9' | 'l9' | 'm9' | 'n9' | 'o9' | 'p9' |
 'a10' | 'b10' | 'c10' | 'd10' | 'e10' | 'f10' | 'g10' | 'h10' | 'i10' | 'j10' | 'k10' | 'l10' | 'm10' | 'n10' | 'o10' | 'p10' |
 'a11' | 'b11' | 'c11' | 'd11' | 'e11' | 'f11' | 'g11' | 'h11' | 'i11' | 'j11' | 'k11' | 'l11' | 'm11' | 'n11' | 'o11' | 'p11' |
 'a12' | 'b12' | 'c12' | 'd12' | 'e12' | 'f12' | 'g12' | 'h12' | 'i12' | 'j12' | 'k12' | 'l12' | 'm12' | 'n12' | 'o12' | 'p12' |
 'a13' | 'b13' | 'c13' | 'd13' | 'e13' | 'f13' | 'g13' | 'h13' | 'i13' | 'j13' | 'k13' | 'l13' | 'm13' | 'n13' | 'o13' | 'p13' |
 'a14' | 'b14' | 'c14' | 'd14' | 'e14' | 'f14' | 'g14' | 'h14' | 'i14' | 'j14' | 'k14' | 'l14' | 'm14' | 'n14' | 'o14' | 'p14' |
 'a15' | 'b15' | 'c15' | 'd15' | 'e15' | 'f15' | 'g15' | 'h15' | 'i15' | 'j15' | 'k15' | 'l15' | 'm15' | 'n15' | 'o15' | 'p15' |
 'a16' | 'b16' | 'c16' | 'd16' | 'e16' | 'f16' | 'g16' | 'h16' | 'i16' | 'j16' | 'k16' | 'l16' | 'm16' | 'n16' | 'o16' | 'p16' ;

*/
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

export type Role = number;

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

/////////////////////////////////////
// pieceInfos
/////////////////////////////////////

export interface pieceDatum{
    key:number,
    name:string,
    promote:number,
    step?:[number[], number[]],
    run?:[number[], number[]],
    second_step?:[number[], number[]],
}
export interface pieceData{
    [key: string]: pieceDatum;
}
