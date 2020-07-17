import * as util from './util'
import * as cg from './types'

type Mobility = (x1:number, y1:number, x2:number, y2:number) => boolean;

const allPos = util.allKeys.map(util.key2pos);

function diff(a: number, b:number):number {
  return Math.abs(a - b);
}

  /**
   * 駒ごとの動きを設定します。
   * dxとdyは必ず同じ要素数でなければなりません。
    "1" : {
      key: 1, // 駒ID
      name: "玉", // 駒名
      point: 1.0, // 駒の得点
      is_promoted: null, //true: 成り駒、false: 未成り駒、null: 成らず駒
      step: [ // 歩く場合の行先
        [-1, -1, -1, 0, 0, 1, 1, 1], //dx (横の変化量) ※dxとdyは必ず同じ要素数
        [-1, 0, 1, -1, 1, -1, 0, 1]  //dy (縦の変化量)
      ],
      run: [ //走り方向
      ]
    },
  */
  const CHUSHOGI_PIECES = {
    "0" : {
      key: 0, //空白
      name: "　",
      point: 0,
      is_promoted: null,
      step: [],
      run: []
    },
    "1" : {
      key: 1, //玉
      name: "玉",
      point: 0,
      is_promoted: null,
      step: [
        [-1, -1, -1, 0, 0, 1, 1, 1],
        [-1, 0, 1, -1, 1, -1, 0, 1]
      ],
      run: []
    },
    "2" : {
      key: 2, //歩
      name: "歩",
      point: 1.0,
      is_promoted: false,
      step: [
        [0],
        [1]
      ],
      run: []
    },
    "3" : {
      key: 3, //仲
      name: "仲",
      point: 1.6,
      is_promoted: false,
      step: [
        [0, 0],
        [-1, 1]
      ],
      run: []
    },
    "4" : {
      key: 4, //銅
      name: "銅",
      point: 3.0,
      is_promoted: false,
      step: [
        [0, 0, -1, 1],
        [-1, 1, 1, 1]
      ],
      run: []
    },
    "5" : {
      key: 5, //銀
      name: "銀",
      point: 3.4,
      is_promoted: false,
      step: [
        [-1, 1, 0, -1, 1],
        [-1, -1, 1, 1, 1]
      ],
      run: []
    },
    "6" : {
      key: 6, //豹
      name: "豹",
      point: 4.0,
      is_promoted: false,
      step: [
        [-1, 1, 0, 0, -1, 1],
        [-1, -1, 1, -1, 1, 1]
      ],
      run: []
    },
    "7" : {
      key: 7, //金
      name: "金",
      point: 4.4,
      is_promoted: false,
      step: [
        [-1, -1, 0, 0, 1, 1],
        [1, 0, 1, -1, 1, 0]
      ],
      run: []
    },
    "8" : {
      key: 8, //盲
      name: "盲",
      point: 4.7,
      is_promoted: false,
      step: [
        [-1, -1, -1, 0, 1, 1, 1],
        [-1, 0, 1, -1, -1, 0, 1]
      ],
      run: []
    },
    "9" : {
      key: 9, //酔
      name: "酔",
      point: 5.9,
      is_promoted: false,
      step: [
        [-1, -1, -1, 0, 1, 1, 1],
        [-1, 0, 1, 1, -1, 0, 1]
      ],
      run: []
    },
    "10" : {
      key: 10, //麒
      name: "麒",
      point: 6.4,
      is_promoted: false,
      step: [
        [-1, 1, -1, 1, 0, 0, -2, 2],
        [-1, -1, 1, 1, -2, 2, 0, 0],
      ],
      run: []
    },
    "11" : {
      key: 11, //鳳
      name: "鳳",
      point: 5.7,
      is_promoted: false,
      step: [
        [0, 0, -1, 1, -2, -2, 2, 2],
        [-1, 1, 0, 0, -2, 2, -2, 2],
      ],
      run: []
    },
    "12" : {
      key: 12, //香
      name: "香",
      point: 3.5,
      is_promoted: false,
      step: [],
      run: [
        [0],
        [1],
      ]
    },
    "13" : {
      key: 13, //反
      name: "反",
      point: 4.9,
      is_promoted: false,
      step: [],
      run: [
        [0, 0],
        [1, -1],
      ]
    },
    "14" : {
      key: 14, //横
      name: "横",
      point: 6.4,
      is_promoted: false,
      step: [
        [0, 0],
        [-1, 1]
      ],
      run: [
        [-1, 1],
        [0, 0],
      ]
    },
    "15" : {
      key: 15, //竪
      name: "竪",
      point: 6.4,
      is_promoted: false,
      step: [
        [-1, 1],
        [0, 0]
      ],
      run: [
        [0, 0],
        [1, -1],
      ]
    },
    "16" : {
      key: 16, //角
      name: "角",
      point: 6.7,
      is_promoted: false,
      step: [],
      run: [
        [-1, -1, 1, 1],
        [-1, 1, -1, 1],
      ]
    },
    "17" : {
      key: 17, //飛
      name: "飛",
      point: 9.5,
      is_promoted: false,
      step: [],
      run: [
        [0, 0, -1, 1],
        [-1, 1, 0, 0],
      ]
    },
    "18" : {
      key: 18, //馬
      name: "馬",
      point: 9.7,
      is_promoted: false,
      step: [
        [0, 0, -1, 1],
        [-1, 1, 0, 0],
      ],
      run: [
        [-1, -1, 1, 1],
        [-1, 1, -1, 1],
      ]
    },
    "19" : {
      key: 19, //龍
      name: "龍",
      point: 12.1,
      is_promoted: false,
      step: [
        [0, 0, -1, 1],
        [-1, 1, 0, 0],
      ],
      run: [
        [0, 0, -1, 1],
        [-1, 1, 0, 0],
      ]
    },
    "20" : {
      key: 20, //奔
      name: "奔",
      point: 14.1,
      is_promoted: null,
      step: [],
      run: [
        [-1, -1, -1, 0, 0, 1, 1, 1],
        [-1, 0, 1, -1, 1, -1, 0, 1]
      ]
    },
    "21" : {
      key: 21, //獅子
      name: "獅",
      point: 19.1,
      is_promoted: null,
      step: [
        [-1, -1, -1, -1, -1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, -2, -2, -2, -2, -2],
        [-2, -1, 0, 1, 2, -2, -1, 1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2]
      ],
      run: []
    },
    "102" : {
      key: 102, //と金
      name: "と",
      point: 3.5,
      is_promoted: true,
      step: [
        [-1, -1, 0, 0, 1, 1],
        [1, 0, 1, -1, 1, 0]
      ],
      run: []
    },
    "103" : {
      key: 103, //成り酔象
      name: "象",
      point: 4.0,
      is_promoted: true,
      step: [
        [-1, -1, -1, 0, 1, 1, 1],
        [-1, 0, 1, 1, -1, 0, 1]
      ],
      run: []
    },
    "104" : {
      key: 104, //成り横
      name: "横",
      point: 5.4,
      is_promoted: true,
      step: [
        [0, 0],
        [-1, 1]
      ],
      run: [
        [-1, 1],
        [0, 0],
      ]
    },
    "105" : {
      key: 15, //成り竪
      name: "竪",
      point: 5.4,
      is_promoted: true,
      step: [
        [-1, 1],
        [0, 0]
      ],
      run: [
        [0, 0],
        [1, -1],
      ]
    },
    "106" : {
      key: 106, //成り角
      name: "角",
      point: 5.7,
      is_promoted: true,
      step: [],
      run: [
        [-1, -1, 1, 1],
        [-1, 1, -1, 1],
      ]
    },
    "107" : {
      key: 107, //成り飛
      name: "飛",
      point: 8.4,
      is_promoted: true,
      step: [],
      run: [
        [0, 0, -1, 1],
        [-1, 1, 0, 0],
      ]
    },
    "108" : {
      key: 108, //飛鹿
      name: "鹿",
      point: 7.6,
      is_promoted: false,
      step: [
        [-1, -1, -1, 1, 1, 1],
        [-1, 0, 1, -1, 0, 1]
      ],
      run: [
        [0, 0],
        [1, -1],
      ]
    },
    "109" : {
      key: 109, //太子
      name: "太",
      point: 17.6,
      is_promoted: true,
      step: [
        [-1, -1, -1, 0, 0, 1, 1, 1],
        [-1, 0, 1, -1, 1, -1, 0, 1]
      ],
      run: []
    },
    "110" : {
      key: 110, //獅子
      name: "獅",
      point: 19.1,
      is_promoted: true,
      step: [
        [-1, -1, -1, -1, -1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, -2, -2, -2, -2, -2],
        [-2, -1, 0, 1, 2, -2, -1, 1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2]
      ],
      run: []
    },
    "111" : {
      key: 111, //奔王
      name: "奔",
      point: 14.1,
      is_promoted: true,
      step: [],
      run: [
        [-1, -1, -1, 0, 0, 1, 1, 1],
        [-1, 0, 1, -1, 1, -1, 0, 1]
      ]
    },
    "112" : {
      key: 112, //白駒
      name: "白",
      point: 7.0,
      is_promoted: true,
      step: [],
      run: [
        [0, 0, -1, 1],
        [1, -1, 1, 1],
      ]
    },
    "113" : {
      key: 113, //鯨鯢
      name: "鯨",
      point: 7.0,
      is_promoted: true,
      step: [],
      run: [
        [0, 0, -1, 1],
        [1, -1, -1, -1],
      ]
    },
    "114" : {
      key: 114, //奔猪
      name: "猪",
      point: 9.9,
      is_promoted: true,
      step: [],
      run: [
        [-1, -1, -1, 1, 1, 1],
        [-1, 0, 1, -1, 0, 1],
      ]
    },
    "115" : {
      key: 115, //飛牛
      name: "牛",
      point: 9.9,
      is_promoted: true,
      step: [],
      run: [
        [-1, 0, -1, 1, 0, 1],
        [-1, -1, 1, -1, 1, 1],
      ]
    },
    "116" : {
      key: 116, //成り馬
      name: "馬",
      point: 8.1,
      is_promoted: true,
      step: [
        [0, 0, -1, 1],
        [-1, 1, 0, 0],
      ],
      run: [
        [-1, -1, 1, 1],
        [-1, 1, -1, 1],
      ]
    },
    "117" : {
      key: 117, //成り龍
      name: "龍",
      point: 10.6,
      is_promoted: true,
      step: [
        [0, 0, -1, 1],
        [-1, 1, 0, 0],
      ],
      run: [
        [0, 0, -1, 1],
        [-1, 1, 0, 0],
      ]
    },
    "118" : {
      key: 118, //角鷹
      name: "鷹",
      point: 14.0,
      is_promoted: true,
      step: [
      ],
      run: [
        [-1, -1, 0, -1, 1, 1, 1],
        [-1, 0, -1, 1, -1, 0, 1],
      ]
    },
    "119" : {
      key: 119, //飛鷲
      name: "鷲",
      point: 14.8,
      is_promoted: true,
      step: [
      ],
      run: [
        [-1, -1, 0, 1, 1, 0],
        [-1, 0, -1, -1, 0, 1],
      ]
    },
  };

  /**
   * 2回移動を行う場合の駒の動きを規定します。
   * 獅子の動きは単純に2回行動(second_move_type: 1)なのに対し、飛鷲と角鷹は同じ方向に2歩分進む動きとなり、
   * 1回目の動きによって進めるマスが変化する。(second_move_type: 2)
  */
  const CHUSHOGI_SECOND_MOVES = {
    "21" : {
      second_move_type: 1,
      step: [
        [-1, -1, -1, 0, 0, 1, 1, 1],
        [-1, 0, 1, -1, 1, -1, 0, 1]
      ],
    },
    "110" : {
      second_move_type: 1,
      step: [
        [-1, -1, -1, 0, 0, 1, 1, 1],
        [-1, 0, 1, -1, 1, -1, 0, 1]
      ],
    },
    "118" : {
      second_move_type: 2,
      step: [
        
      ],
    },
    "119" : {
      second_move_type: 2,
      step: [
      ],
    },
  };

/**
   * function move
   * 現局面(pieces、マスの座標から、移動先をcg.Key型の配列で返します。
   * {key:"a2" => cg.Pos:["a3", "a4"]}
   * 
*/
export function move(pieces: cg.Pieces, key: cg.Key): cg.Key[]{

  //戻り値
  let pos2: cg.Key[] = new Array();

  const piece = pieces[key]!,
  pos = util.key2pos(key),
  x:number = pos[0],
  y:number = pos[1];

  let dx: number[]; //横の変化量
  let dy: number[]; //縦の変化量
  let xx: number; //移動先の座標x
  let yy: number; //移動先の座標y

  // 歩く動き
  if(CHUSHOGI_PIECES[piece.role]["step"].length){
    dx = CHUSHOGI_PIECES[piece.role]["step"][0];
    dy = CHUSHOGI_PIECES[piece.role]["step"][1];
    for(let i = 0; i < dx.length; i++){
        xx = (piece.color === "black" ? x - dx[i] : x + dx[i]);
        yy = (piece.color === "black" ? y - dy[i] : y + dy[i]);
        
        //盤の範囲
        if(0 <= xx && xx < cg.size && 0 <= yy && yy < cg.size){
            let dest_key = util.pos2key([xx, yy]);
            let target_piece = pieces[dest_key];
            //味方の駒でなければ
            if(!target_piece || target_piece.color !== piece.color){
              pos2.push(dest_key);
            }
        }
    }
  }

  // 走る動き
  if(CHUSHOGI_PIECES[piece.role]["run"].length){
      dx = CHUSHOGI_PIECES[piece.role]["run"][0];
      dy = CHUSHOGI_PIECES[piece.role]["run"][1];
      for(let i = 0; i < dx.length; ++i){
          xx = x - dx[i];
          yy = piece.color === "black" ? y - dy[i] : y + dy[i];

          //盤の端まで繰り返す
          while(0 <= xx && xx < cg.size && 0 <= yy && yy < cg.size){
            let dest_key = util.pos2key([xx, yy]);
            let target_piece = pieces[dest_key];
            if(dest_key){
              //味方の駒が射線上にある時
              if(target_piece){
                if(target_piece.color !== piece.color){
                  pos2.push(dest_key);
                  break;
                } else if(target_piece.color === piece.color){
                  break;
                }
              } else {
                pos2.push(dest_key);
              }
            }
            xx -= dx[i];
            yy = piece.color === "black" ? yy - dy[i] : yy + dy[i];
          }
      }
  }
  return pos2;
}