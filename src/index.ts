
import renderWrap from './wrap';
import { State, defaults } from './state'
import render from './render';
import * as util from './util'
import * as events from './events'
import * as svg from './svg';
import * as cg from './types'

import premove from './premove'
import { move } from './move'

//////// API ///////////////////
/*


// see API types and documentations in dts/api.d.ts
function start(state: State): Api {
  return {
      state,
      //moveという関数を返す
      move(orig, dest) {
      	
    	}
  }
};
*/
//////////// api //////////////////
interface Api {
  state: State;
  redrawAll: cg.Redraw;
  selectSquare(key: cg.Key | null, force?: boolean): void;
}

function start(state: State, redrawAll: cg.Redraw): Api {
/*
    //白番か黒番かを確認する
    function toggleOrientation() {
      board.toggleOrientation(state);
      redrawAll();
    };
*/
    return {
      state,
      redrawAll,
      selectSquare(key, force) {
        /*
        if (key) anim(state => board.selectSquare(state, key, force), state);
        else if (state.selected) {
          board.unselect(state);
          state.dom.redraw();
        }
        */
      },
    }
}



////////// chess ground ////////////
function legalMove(state: State): cg.Dests {
  let dests = {};
  let s_time = new Date();
  for(const c of util.allKeys){
    if(state.pieces[c] && state.pieces[c].color === state.orientation){
      dests[c] = move(state.pieces, c);
    }
  }
  let e_time = new Date();
  var diff = e_time.getTime() - s_time.getTime();
  console.log("経過時間(ミリ秒):", diff);
  return dests;
}



function Chessground(element: HTMLElement): Api {
  const state = defaults() as State;
  state.movable.dests = legalMove(state);
  function redrawAll() {

    let prevUnbind = state.dom && state.dom.unbind;
    const relative = state.viewOnly && !state.drawable.visible,
    elements = renderWrap(element, state, relative),
    bounds = util.memo(() => elements.board.getBoundingClientRect());

    const redrawNow = (skipSvg?: boolean) => {
      render(state);
      if (!skipSvg && elements.svg) svg.renderSvg(state, elements.svg);
    };
    state.dom = {
        elements,
        bounds,
        redraw:debounceRedraw(redrawNow),
        redrawNow,
        unbind: prevUnbind,
        relative
    }
    redrawNow(false);

    //events
    events.bindBoard(state);
    if (!prevUnbind) state.dom.unbind = events.bindDocument(state, redrawAll);
    state.events.insert && state.events.insert(elements);
  }
  redrawAll();
  return start(state, redrawAll);
}

function debounceRedraw(redrawNow: (skipSvg?: boolean) => void): () => void {
  let redrawing = false;
  return () => {
    if (redrawing) return;
    redrawing = true;
    requestAnimationFrame(() => {
      redrawNow();
      redrawing = false;
    });
  };
}

Chessground(document.getElementById("app"));

/////////// config //////////
/*
interface Config {
  orientation?: cg.Color; // board orientation. white | black
}
function configure(state: State, config: Config) {
  merge(state, config);
}

function merge(base: any, extend: any) {
  for (let key in extend) {
    if (isObject(base[key]) && isObject(extend[key])) merge(base[key], extend[key]);
    else base[key] = extend[key];
  }
}

function isObject(o: any): boolean {
  return typeof o === 'object';
}
*/
