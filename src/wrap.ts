
import { files, ranks, Elements } from './types'
import { colors, setVisible, createEl } from './util'
import { State } from './state'
import { createElement as createSVG } from './svg'


export default function renderWrap(element: HTMLElement, s: State, relative: boolean): Elements {
  
    element.innerHTML = '';
  
    // ensure the cg-wrap class is set
    // so bounds calculation can use the CSS width/height values
    // add that class yourself to the element before calling chessground
    // for a slight performance improvement! (avoids recomputing style)
    element.classList.add('cg-wrap');
  
    colors.forEach(c => element.classList.toggle('orientation-' + c, s.orientation === c));
    element.classList.toggle('manipulable', !s.viewOnly);
  
    const helper = createEl('cg-helper');
    element.appendChild(helper);
    const container = createEl('cg-container');
    helper.appendChild(container);
  
    const board = createEl('cg-board');
    container.appendChild(board);

    let svg: SVGElement | undefined;
    if (s.drawable.visible && !relative) {
      svg = createSVG('svg');
      svg.appendChild(createSVG('defs'));
      container.appendChild(svg);
    }

    if (s.coordinates) {
      const orientClass = s.orientation === 'black' ? ' black' : '';
      container.appendChild(renderCoords(ranks, 'ranks' + orientClass));
      container.appendChild(renderCoords(files, 'files' + orientClass));
    }

    let ghost: HTMLElement | undefined;
    if (s.draggable.showGhost && !relative) {
      ghost = createEl('piece', 'ghost');
      setVisible(ghost, false);
      container.appendChild(ghost);
    }
  
    return {
      board,
      container,
      ghost,
      svg
    };
  }

  function renderCoords(elems: any[], className: string): HTMLElement {
    const el = createEl('coords', className);
    let f: HTMLElement;
    for (let i in elems) {
      f = createEl('coord');
      f.textContent = elems[i];
      el.appendChild(f);
    }
    return el;
  }
  
  
  