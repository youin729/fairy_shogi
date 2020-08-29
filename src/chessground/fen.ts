import { pos2key } from './util'
import * as cg from './types'

export const initial: cg.FEN = 'rrnbbqkbbnrr/pppppppppppp/0/0/0/0/0/PPPPPPPPPPPP/RRNBBQKBBNRR';

//駒はcssと画像ファイルで結びつける
export const initial_cfen: cg.FEN = '[-3][-11][-10][-5][-6][-13][-1][-6][-5][-10][-11][-3]/[-16]1[-7]1[-12][-14][-15][-12]1[-7]1[-16]/[-17][-18][-8][-19][-20][-21][-22][-20][-19][-8][-18][-17]/[-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2][-2]/3[-9]4[-9]3/12/12/3[9]4[9]3/[2][2][2][2][2][2][2][2][2][2][2][2]/[17][18][8][19][20][22][21][20][19][8][18][17]/[16]1[7]1[12][15][14][12]1[7]1[16]/[3][11][10][5][6][1][13][6][5][10][11][3] b - 1'

export function read(fen: cg.FEN): cg.Pieces {
  if (fen === 'start') fen = initial_cfen;
  const pieces: cg.Pieces = {};
  let row: number = 1, col: number = cg.size;

  const l = fen.length;
  for (let p = 0; p < l; p++) {
    let c = fen.charAt(p);
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
        pieces[pos2key([col, row])] = {
          role: Math.abs(piece_id),
          color: (piece_id < 0 ? 'white' : 'black') as cg.Color
        };
        col--;
        break;
      default:
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
  let fen:string = "";
  for(const y of cg.ranks){
    let fen_row:string = "";
    for(const x of cg.ranks){
      const piece = pieces[pos2key([x, y])];
      if (piece) {
        fen_row += piece.color === 'white' ? "[-" + piece.role + "]" : "[" + piece.role + "]";
      } else {
        let n = parseInt(fen_row.slice(-1));
        if(!isNaN(n)){
          fen_row = fen_row.slice(0,-1) + String(n + 1)
        } else {
          fen_row += "1"
        }
      }
    }
    fen += fen_row + "/";
  }
  return fen;
}

