
import RoundController from '../index';
import { ClockElements, ClockController, Millis } from './clockCtrl';
import { Player } from '../game/interfaces';
import { Position } from '../interfaces';
/*
export function renderClock(ctrl: RoundController, player: Player, position: Position) {
  //const h = require('snabbdom')
  const clock = ctrl.clock!,
    millis = clock.millisOf(player.color),
    isPlayer = ctrl.data.player.color === player.color,
    isRunning = player.color === clock.times.activeColor;
  const update = (el: HTMLElement) => {
    const els = clock.elements[player.color],
       millis = clock.millisOf(player.color),
       isRunning = player.color === clock.times.activeColor;
    els.time = el;
    els.clock = el.parentElement!;
    el.innerHTML = formatClockTime(millis, clock.showTenths(millis), isRunning, clock.opts.nvui);
  }

  const timeHook = {
    insert: (vnode) => update(vnode.elm as HTMLElement),
    postpatch: (_, vnode) => update(vnode.elm as HTMLElement)
  };
  return /*h('div.rclock.rclock-' + position, {
    class: {
      outoftime: millis <= 0,
      running: isRunning,
      emerg: millis < clock.emergMs
    }
  }, clock.opts.nvui ? [
    h('div.time', {
      attrs: { role: 'timer' },
      hook: timeHook
    })
  ] : [
    h('div.time', {
      attrs: { title: `${player.color} clock` },
      class: {
        hour: millis > 3600 * 1000
      },
      hook: timeHook
    })
  ]);
}
*/
export function renderClock(clock: ClockController, player: Player, el: HTMLElement) {
  const els = clock.elements[player.color],
    millis = clock.millisOf(player.color),
    isRunning = player.color === clock.times.activeColor;
  els.time = el;
  console.log(el)
  els.clock = el.parentElement!;
  el.innerHTML = formatClockTime(millis, clock.showTenths(millis), isRunning, clock.opts.nvui);
}

function pad2(num: number): string {
  return (num < 10 ? '0' : '') + num;
}

const sepHigh = '<sep>:</sep>';
const sepLow = '<sep class="low">:</sep>';

function formatClockTime(time: Millis, showTenths: boolean, isRunning: boolean, nvui: boolean) {
  const date = new Date(time);
  const millis = date.getUTCMilliseconds(),
    sep = (isRunning && millis < 500) ? sepLow : sepHigh,
    baseStr = pad2(date.getUTCMinutes()) + sep + pad2(date.getUTCSeconds());
  if (time >= 3600000) {
    const hours = pad2(Math.floor(time / 3600000));
    return hours + sepHigh + baseStr;
  } else if (showTenths) {
    let tenthsStr = Math.floor(millis / 100).toString();
    if (!isRunning && time < 1000) {
      tenthsStr += '<huns>' + (Math.floor(millis / 10) % 10) + '</huns>';
    }

    return baseStr + '<tenths><sep>.</sep>' + tenthsStr + '</tenths>';
  } else {
    return baseStr;
  }
}

export function updateElements(clock: ClockController, els: ClockElements, millis: Millis) {
  if (els.time) els.time.innerHTML = formatClockTime(millis, clock.showTenths(millis), true, clock.opts.nvui);
  if (els.clock) {
    const cl = els.clock.classList;
    if (millis < clock.emergMs) cl.add('emerg');
    else if (cl.contains('emerg')) cl.remove('emerg');
  }
}
