import * as cg from './types';

export const allKeys: cg.Key[] = Array.prototype.concat(...cg.files.map(c => cg.ranks.map(r => c+r)));
export const pos2key = (pos: cg.Pos) => allKeys[cg.size * pos[0] + pos[1] - (cg.size + 1)];
export const colors: cg.Color[] = ['white', 'black'];
export const key2pos = (k: cg.Key) => [k.charCodeAt(0) - 96, parseInt(k.substr(1))] as cg.Pos;

export function memo<A>(f: () => A): cg.Memo<A> {
    let v: A | undefined;
    const ret: any = () => {
      if (v === undefined) v = f();
      return v;
    };
    ret.clear = () => { v = undefined };
    return ret;
}
export function containsX<X>(xs: X[] | undefined, x: X): boolean {
    return xs !== undefined && xs.indexOf(x) !== -1;
}

export const opposite = (c: cg.Color) => c === 'white' ? 'black' : 'white';

export const timer: () => cg.Timer = () => {
    let startAt: number | undefined;
    return {
      start() { startAt = performance.now() },
      cancel() { startAt = undefined },
      stop() {
        if (!startAt) return 0;
        const time = performance.now() - startAt;
        startAt = undefined;
        return time;
      }
    };
}

////posToTrans
export const posToTranslateBase: (pos: cg.Pos, asWhite: boolean, xFactor: number, yFactor: number) => cg.NumberPair =
(pos, asWhite, xFactor, yFactor) => [
  (asWhite ? pos[0] - 1 : cg.size - pos[0]) * xFactor,
  (asWhite ? cg.size - pos[1] : pos[1] - 1) * yFactor
];

export const translateAbs = (el: HTMLElement, pos: cg.NumberPair) => {
    el.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
}

export const translateRel = (el: HTMLElement, percents: cg.NumberPair) => {
    el.style.transform = `translate(${percents[0]}%,${percents[1]}%)`;
}

export const posToTranslateRel: (pos: cg.Pos, asWhite: boolean) => cg.NumberPair =
  (pos, asWhite) => posToTranslateBase(pos, asWhite, 100, 100);

export const posToTranslateAbs = (bounds: ClientRect) => {
    const xFactor = bounds.width / cg.size,
    yFactor = bounds.height / cg.size;
    return (pos: cg.Pos, asWhite: boolean) => posToTranslateBase(pos, asWhite, xFactor, yFactor);
};
////////////

export const distanceSq: (pos1: cg.Pos, pos2: cg.Pos) => number = (pos1, pos2) => {
    return Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2);
}
  
export const samePiece: (p1: cg.Piece, p2: cg.Piece) => boolean = (p1, p2) =>
  p1.role === p2.role && p1.color === p2.color;

export const eventPosition: (e: cg.MouchEvent) => cg.NumberPair | undefined = e => {
    if (e.clientX || e.clientX === 0) return [e.clientX, e.clientY];
    if (e.touches && e.targetTouches[0]) return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
    return undefined;
}

export const setVisible = (el: HTMLElement, v: boolean) => {
    el.style.visibility = v ? 'visible' : 'hidden';
}

export const isRightButton = (e: MouseEvent) => e.buttons === 2 || e.button === 2;

export const createEl = (tagName: string, className?: string) => {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  return el;
}