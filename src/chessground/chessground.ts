import { Api, start } from './api';
import renderWrap from './wrap';
import { Config, configure } from './config'
import { State, defaults } from './state';
import render from './render';
import * as util from './util'
import * as events from './events';
import * as svg from './svg';

export function Chessground(element: HTMLElement, config?: Config): Api {
  const state = defaults() as State;
  
  configure(state, config || {});

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
