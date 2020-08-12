import { pos2key } from './util'
import * as cg from './types'

export const initial: cg.FEN = 'rrnbbqkbbnrr/pppppppppppp/0/0/0/0/0/PPPPPPPPPPPP/RRNBBQKBBNRR';
//export const initial: cg.FEN = 'rnbqkbnrr/ppppppppp/9/9/9/9/9/PPPPPPPPP/RNBQKBNRR';
//export const initial: cg.FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
//export const initial : cg.FEN = '8/6R1/1k1r2p1/1P3p1p/N1Pnp3/2K3P1/3p1P2/8 b - - 2 47';
//export const initial_cfen: cg.FEN = '[-17][-18][-8][-19][-20][-22][-21][-20][-19][-8][-18][-17]/[-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2]/3[-9]4[-9]3/12/12/3[9]4[9]3/[2][2][2][2][2][2][2][2][2][2][2][2]/[17][18][8][19][20][22][21][20][19][8][18][17]/[16]1[7]1[12][15][14][15][12][5]1[7]1[16]/[3][11][10][5][6][1][13][6][5][10][11][3] b - 1'
//const roles: { [letter: string]: cg.Role } = { p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', q: 'queen', k: 'king' };
//const letters = { pawn: 'p', rook: 'r', knight: 'n', bishop: 'b', queen: 'q', king: 'k' };

//駒はcssと画像ファイルで結びつける
export const initial_cfen: cg.FEN = '[-3][-11][-10][-5][-6][-1][-13][-6][-5][-10][-11][-3]/[-16]1[-7]1[-12][-15][-14][-12]1[-7]1[-16]/[-17][-18][-8][-19][-20][-22][-21][-20][-19][-8][-18][-17]/[-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2]/3[-9]4[-9]3/12/12/3[9]4[9]3/[2][2][2][2][2][2][2][2][2][2][2][2]/[17][18][8][19][20][22][21][20][19][8][18][17]/[16]1[7]1[12][15][14][12]1[7]1[16]/[3][11][10][5][6][1][13][6][5][10][11][3] b - 1'

export function read(fen: cg.FEN): cg.Pieces {
  if (fen === 'start') fen = initial_cfen;
  const pieces: cg.Pieces = {};
  let row: number = 1, col: number = cg.size;

  const l = fen.length;
  for (let p = 0; p < l; p++) {
    let c = fen.charAt(p);
    /*
    alert("p:" + p);
    alert("start:" + fen.charAt(p));
    */
    switch (c) {
      case ' ': return pieces;
      case '/':
        row++;
        if (row > cg.size) return pieces;
        col = cg.size;
        break;
      //promoted
      case '~':
        /*
        const piece = pieces[pos2key([col, row])];
        if (piece) piece.promoted = true;
        break;
        */
      case '[':
        let piece_str:string = "";
        while(true){
          p++;
          c = fen.charAt(p);

          if(c !== "]"){
            piece_str += fen.charAt(p);
          } else {
            break;
          }
        }
        
        let piece_id = parseInt(piece_str);
        //alert("pos:" +  col + row);
        //alert("role:" +  piece_id);
        pieces[pos2key([col, row])] = {
          role: Math.abs(piece_id),
          color: (piece_id < 0 ? 'white' : 'black') as cg.Color
        };
        col--;
        break;
      default:
        //nb: 48 ~ 57 = 1 ~ 9
        const nb:number = fen.charCodeAt(p);
        const nb_s:string = fen.charAt(p);
        const nnb:number = fen.charCodeAt(p + 1);
        const nnb_s:string = fen.charAt(p + 1);

        if(nb < 58 && nnb < 58){
          col = col - parseInt(nb_s + nnb_s);
        } else if (nb < 58){
          col = col - parseInt(nb_s);
        }
    }
  }
  return pieces;
}

export function write(pieces: cg.Pieces): cg.FEN {
  return cg.ranks.map(y => cg.ranks.map(x => {
      const piece = pieces[pos2key([x, y])];
      if (piece) {
        return piece.color === 'white' ? "[-" + piece.role + "]" : "[" + piece.role + "]";
      } else return '1';
    }).join('')
  ).join('/').replace(/1{2,}/g, s => s.length.toString());
}

