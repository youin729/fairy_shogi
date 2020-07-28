import { pos2key, invRanks } from './util'
import * as cg from './types'

export const initial: cg.FEN = 'rrnbbqkbbnrr/pppppppppppp/0/0/0/0/0/PPPPPPPPPPPP/RRNBBQKBBNRR';
//export const initial: cg.FEN = 'rnbqkbnrr/ppppppppp/9/9/9/9/9/PPPPPPPPP/RNBQKBNRR';
//export const initial: cg.FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
///export const initial : cg.FEN = '8/6R1/1k1r2p1/1P3p1p/N1Pnp3/2K3P1/3p1P2/8 b - - 2 47';

//const roles: { [letter: string]: cg.Role } = { p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', q: 'queen', k: 'king' };
const letters = { pawn: 'p', rook: 'r', knight: 'n', bishop: 'b', queen: 'q', king: 'k' };

export function chushogi_read(): cg.Pieces {
  const pieces: cg.Pieces = {};
  let role = 'black';

  //////// 1st row ////////
  pieces[pos2key([1,1])] = {
    role: '12',
    color: 'white' as cg.Color
  };
  pieces[pos2key([2,1])] = {
    role: '6',
    color: 'white' as cg.Color
  };
  pieces[pos2key([3,1])] = {
    role: '4',
    color: 'white' as cg.Color
  };
  pieces[pos2key([4,1])] = {
    role: '5',
    color: 'white' as cg.Color
  };
  pieces[pos2key([5,1])] = {
    role: '7',
    color: 'white' as cg.Color
  };
  pieces[pos2key([6,1])] = {
    role: '1',
    color: 'white' as cg.Color
  };
  pieces[pos2key([7,1])] = {
    role: '9',
    color: 'white' as cg.Color
  };
  pieces[pos2key([8,1])] = {
    role: '7',
    color: 'white' as cg.Color
  };
  pieces[pos2key([9,1])] = {
    role: '5',
    color: 'white' as cg.Color
  };
  pieces[pos2key([10,1])] = {
    role: '4',
    color: 'white' as cg.Color
  };
  pieces[pos2key([11,1])] = {
    role: '6',
    color: 'white' as cg.Color
  };
  pieces[pos2key([12,1])] = {
    role: '12',
    color: 'white' as cg.Color
  };


  //////// 2nd row ////////
  pieces[pos2key([1,2])] = {
    role: '13',
    color: 'white' as cg.Color
  };
  pieces[pos2key([3,2])] = {
    role: '16',
    color: 'white' as cg.Color
  };
  pieces[pos2key([5,2])] = {
    role: '8',
    color: 'white' as cg.Color
  };
  pieces[pos2key([6,2])] = {
    role: '10',
    color: 'white' as cg.Color
  };
  pieces[pos2key([7,2])] = {
    role: '11',
    color: 'white' as cg.Color
  };
  pieces[pos2key([8,2])] = {
    role: '8',
    color: 'white' as cg.Color
  };
  pieces[pos2key([10,2])] = {
    role: '16',
    color: 'white' as cg.Color
  };
  pieces[pos2key([12,2])] = {
    role: '13',
    color: 'white' as cg.Color
  };

  //////// 3rd row ////////
  pieces[pos2key([1,3])] = {
    role: '14',
    color: 'white' as cg.Color
  };
  pieces[pos2key([2,3])] = {
    role: '15',
    color: 'white' as cg.Color
  };
  pieces[pos2key([3,3])] = {
    role: '17',
    color: 'white' as cg.Color
  };
  pieces[pos2key([4,3])] = {
    role: '18',
    color: 'white' as cg.Color
  };
  pieces[pos2key([5,3])] = {
    role: '19',
    color: 'white' as cg.Color
  };
  pieces[pos2key([6,3])] = {
    role: '21',
    color: 'white' as cg.Color
  };
  pieces[pos2key([7,3])] = {
    role: '20',
    color: 'white' as cg.Color
  };
  pieces[pos2key([8,3])] = {
    role: '19',
    color: 'white' as cg.Color
  };
  pieces[pos2key([9,3])] = {
    role: '18',
    color: 'white' as cg.Color
  };
  pieces[pos2key([10,3])] = {
    role: '17',
    color: 'white' as cg.Color
  };
  pieces[pos2key([11,3])] = {
    role: '15',
    color: 'white' as cg.Color
  };
  pieces[pos2key([12,3])] = {
    role: '14',
    color: 'white' as cg.Color
  };

  
  //////// 4th row ////////
  pieces[pos2key([1,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };
  pieces[pos2key([2,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };
  pieces[pos2key([3,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };
  pieces[pos2key([4,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };
  pieces[pos2key([5,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };
  pieces[pos2key([6,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };
  pieces[pos2key([7,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };
  pieces[pos2key([8,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };
  pieces[pos2key([9,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };
  pieces[pos2key([10,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };
  pieces[pos2key([11,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };
  pieces[pos2key([12,4])] = {
    role: '2',
    color: 'white' as cg.Color
  };

  //////// 5th row ////////
  pieces[pos2key([4,5])] = {
    role: '3',
    color: 'white' as cg.Color
  };
  pieces[pos2key([9,5])] = {
    role: '3',
    color: 'white' as cg.Color
  };

  //////// 1st row ////////
  pieces[pos2key([1,12])] = {
    role: '12',
    color: 'black' as cg.Color
  };
  pieces[pos2key([2,12])] = {
    role: '6',
    color: 'black' as cg.Color
  };
  pieces[pos2key([3,12])] = {
    role: '4',
    color: 'black' as cg.Color
  };
  pieces[pos2key([4,12])] = {
    role: '5',
    color: 'black' as cg.Color
  };
  pieces[pos2key([5,12])] = {
    role: '7',
    color: 'black' as cg.Color
  };
  pieces[pos2key([6,12])] = {
    role: '1',
    color: 'black' as cg.Color
  };
  pieces[pos2key([7,12])] = {
    role: '9',
    color: 'black' as cg.Color
  };
  pieces[pos2key([8,12])] = {
    role: '7',
    color: 'black' as cg.Color
  };
  pieces[pos2key([9,12])] = {
    role: '5',
    color: 'black' as cg.Color
  };
  pieces[pos2key([10,12])] = {
    role: '4',
    color: 'black' as cg.Color
  };
  pieces[pos2key([11,12])] = {
    role: '6',
    color: 'black' as cg.Color
  };
  pieces[pos2key([12,12])] = {
    role: '12',
    color: 'black' as cg.Color
  };


  //////// 2nd row ////////
  pieces[pos2key([1,11])] = {
    role: '13',
    color: 'black' as cg.Color
  };
  pieces[pos2key([3,11])] = {
    role: '16',
    color: 'black' as cg.Color
  };
  pieces[pos2key([5,11])] = {
    role: '8',
    color: 'black' as cg.Color
  };
  pieces[pos2key([6,11])] = {
    role: '10',
    color: 'black' as cg.Color
  };
  pieces[pos2key([7,11])] = {
    role: '11',
    color: 'black' as cg.Color
  };
  pieces[pos2key([8,11])] = {
    role: '8',
    color: 'black' as cg.Color
  };
  pieces[pos2key([10,11])] = {
    role: '16',
    color: 'black' as cg.Color
  };
  pieces[pos2key([12,11])] = {
    role: '13',
    color: 'black' as cg.Color
  };

  //////// 3rd row ////////
  pieces[pos2key([1,10])] = {
    role: '14',
    color: 'black' as cg.Color
  };
  pieces[pos2key([2,10])] = {
    role: '15',
    color: 'black' as cg.Color
  };
  pieces[pos2key([3,10])] = {
    role: '17',
    color: 'black' as cg.Color
  };
  pieces[pos2key([4,10])] = {
    role: '18',
    color: 'black' as cg.Color
  };
  pieces[pos2key([5,10])] = {
    role: '19',
    color: 'black' as cg.Color
  };
  pieces[pos2key([6,10])] = {
    role: '21',
    color: 'black' as cg.Color
  };
  pieces[pos2key([7,10])] = {
    role: '20',
    color: 'black' as cg.Color
  };
  pieces[pos2key([8,10])] = {
    role: '19',
    color: 'black' as cg.Color
  };
  pieces[pos2key([9,10])] = {
    role: '18',
    color: 'black' as cg.Color
  };
  pieces[pos2key([10,10])] = {
    role: '17',
    color: 'black' as cg.Color
  };
  pieces[pos2key([11,10])] = {
    role: '15',
    color: 'black' as cg.Color
  };
  pieces[pos2key([12,10])] = {
    role: '14',
    color: 'black' as cg.Color
  };
  
  //////// 4th row ////////
  pieces[pos2key([1,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };
  pieces[pos2key([2,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };
  pieces[pos2key([3,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };
  pieces[pos2key([4,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };
  pieces[pos2key([5,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };
  pieces[pos2key([6,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };
  pieces[pos2key([7,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };
  pieces[pos2key([8,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };
  pieces[pos2key([9,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };
  pieces[pos2key([10,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };
  pieces[pos2key([11,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };
  pieces[pos2key([12,9])] = {
    role: '2',
    color: 'black' as cg.Color
  };

  //////// 5th row ////////
  pieces[pos2key([4,8])] = {
    role: '3',
    color: 'black' as cg.Color
  };
  pieces[pos2key([9,8])] = {
    role: '3',
    color: 'black' as cg.Color
  };
  
  /*
  pieces[pos2key([col, row])] = {
    role: roles[role],
    color: (c === role ? 'black' : 'white') as cg.Color
  };
  */
  return pieces;
}

export function read(fen: cg.FEN): cg.Pieces {
  if (fen === 'start') fen = initial;
  const pieces: cg.Pieces = {};
  let row: number = cg.size, col: number = 0;
  for (const c of fen) {
    switch (c) {
      case ' ': return pieces;
      case '/':
        --row;
        if (row === 0) return pieces;
        col = 0;
        break;
      case '~':
        const piece = pieces[pos2key([col, row])];
        if (piece) piece.promoted = true;
        break;
      default:
        const nb = c.charCodeAt(0);
        if (nb < 58) col += nb - 48;
        else {
          ++col;
          const role = c.toLowerCase();
          pieces[pos2key([col, row])] = {
            role: "1",//roles[role],
            color: (c === role ? 'black' : 'white') as cg.Color
          };
        }
    }
  }
  return pieces;
}

export function write(pieces: cg.Pieces): cg.FEN {
  return invRanks.map(y => cg.ranks.map(x => {
      const piece = pieces[pos2key([x, y])];
      if (piece) {
        const letter = letters[piece.role];
        return piece.color === 'white' ? letter.toUpperCase() : letter;
      } else return '1';
    }).join('')
  ).join('/').replace(/1{2,}/g, s => s.length.toString());
}
