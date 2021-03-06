import * as cg from './types';
import { AnimCurrent } from './anim'
import { DragCurrent } from './drag'
import * as fen from './fen';
import { Drawable } from './draw'
import { timer } from './util'

export interface State {
    pieces: cg.Pieces;
    orientation: cg.Color; // board orientation. white | black
    turnColor: cg.Color; // turn to play. white | black
    check?: cg.Key; // square currently in check "a2"
    lastMove?: cg.Key[]; // squares part of the last move ["c3"; "c4"]
    pieceInfos?: cg.pieceData, // piece move and promote infomation
    selected?: cg.Key; // square currently selected "a1"
    coordinates: boolean; // include coords attributes
    multimove?: boolean; // in multimove, stepping on same square
    viewOnly: boolean; // don't bind events: the user will never be able to move pieces around
    resizable: boolean; // listens to chessground.resize on document.body to clear bounds cache
    highlight: {
        lastMove: boolean; // add last-move class to squares
        check: boolean; // add check class to squares
    };
    animation: {
        enabled: boolean;
        duration: number;
        current?: AnimCurrent;
    };
    draggable: {
      enabled: boolean; // allow moves & premoves to use drag'n drop
      distance: number; // minimum distance to initiate a drag; in pixels
      autoDistance: boolean; // lets chessground set distance to zero when user drags pieces
      centerPiece: boolean; // center the piece on cursor at drag start
      showGhost: boolean; // show ghost of piece being dragged
      deleteOnDropOff: boolean; // delete a piece when it is dropped off the board
      current?: DragCurrent;
    };
    movable: {
      free: boolean; // all moves are valid - board editor
      color?: cg.Color | 'both'; // color that can move. white | black | both
      dests?: cg.Dests; // valid moves. {"a2" ["a3" "a4"] "b1" ["a3" "c3"]}
      showDests: boolean; // whether to add the move-dest class on squares
      events: {
        after?: (orig: cg.Key, dest: cg.Key, metadata: cg.MoveMetadata) => void; // called after the move has been played
        afterNewPiece?: (role: cg.Role, key: cg.Key, metadata: cg.MoveMetadata) => void; // called after a new piece is dropped on the board
      };
      rookCastle: boolean // castle by moving the king to the rook
    };
    premovable: {
        enabled: boolean; // allow premoves for color that can not move
        showDests: boolean; // whether to add the premove-dest class on squares
        castle: boolean; // whether to allow king castle premoves
        dests?: cg.Dests; // valid moves. {"a2" ["a3" "a4"] "b1" ["a3" "c3"]}
        current?: cg.KeyPair; // keys of the current saved premove ["e2" "e4"]
        events: {
          set?: (orig: cg.Key, dest: cg.Key, metadata?: cg.SetPremoveMetadata) => void; // called after the premove has been set
          unset?: () => void;  // called after the premove has been unset
        }
    };
    predroppable: {
        enabled: boolean; // allow predrops for color that can not move
        current?: { // current saved predrop {role: 'knight'; key: 'e4'}
          role: cg.Role;
          key: cg.Key
        };
        events: {
          set?: (role: cg.Role, key: cg.Key) => void; // called after the predrop has been set
          unset?: () => void; // called after the predrop has been unset
        }
    };
    dropmode: {
      active: boolean;
      piece?: cg.Piece;
    }
    selectable: {
      // disable to enforce dragging over click-click move
      enabled: boolean
    };
    stats: {
        // was last piece dragged or clicked?
        // needs default to false for touch
        dragged: boolean,
        ctrlKey?: boolean
    };
    events: {
      change?: () => void; // called after the situation changes on the board
      // called after a piece has been moved.
      // capturedPiece is undefined or like {color: 'white'; 'role': 'queen'}
      move?: (orig: cg.Key, dest: cg.Key, capturedPiece?: cg.Piece) => void;
      dropNewPiece?: (piece: cg.Piece, key: cg.Key) => void;
      select?: (key: cg.Key) => void // called when a square is selected
      insert?: (elements: cg.Elements) => void; // when the board DOM has been (re)inserted
    };
    drawable: Drawable,
    dom: cg.Dom,
    hold: cg.Timer
}

export function defaults(): Partial<State> {
    return {
        pieces: fen.read("start"),
        orientation: 'black', //if shogi variants 'black' is first
        turnColor: 'black',
        coordinates: true,
        viewOnly: false,
        highlight: {
          lastMove: true,
          check: true
        },
        draggable: {
          enabled: true,
          distance: 3,
          autoDistance: true,
          centerPiece: true,
          showGhost: true,
          deleteOnDropOff: false
        },
        animation: {
          enabled: true,
          duration: 200
        },
        movable: {
          free: true,
          color: 'black',
          showDests: true,
          events: {},
          rookCastle: true
        },
        selectable: {
          enabled: true
        },
        premovable: {
          enabled: true,
          showDests: true,
          castle: true,
          events: {}
        },
        
        predroppable: {
            enabled: false,
            events: {}
        },
        stats: {
            // on touchscreen, default to "tap-tap" moves
            // instead of drag
            dragged: !('ontouchstart' in window)
        },
        events: {},
        drawable: {
            enabled: true, // can draw
            visible: true, // can view
            eraseOnClick: true,
            shapes: [],
            autoShapes: [],
            brushes: {
              green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
              red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
              blue: { key: 'b', color: '#003088', opacity: 1, lineWidth: 10 },
              yellow: { key: 'y', color: '#e68f00', opacity: 1, lineWidth: 10 },
              paleBlue: { key: 'pb', color: '#003088', opacity: 0.4, lineWidth: 15 },
              paleGreen: { key: 'pg', color: '#15781B', opacity: 0.4, lineWidth: 15 },
              paleRed: { key: 'pr', color: '#882020', opacity: 0.4, lineWidth: 15 },
              paleGrey: { key: 'pgr', color: '#4a4a4a', opacity: 0.35, lineWidth: 15 }
            },
            pieces: {
              baseUrl: ''
            },
            prevSvgHash: ''
        },
        dropmode: {
          active: false,
        },
        hold: timer()
    }
}
