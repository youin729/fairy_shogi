
import { updateElements, renderClock } from './clockView';
import { RoundData } from '../interfaces'
import * as game from '../game/game';
import * as _ from '../common/type';

export type Seconds = number;
export type Centis = number;
export type Millis = number;

interface ClockOpts {
  onFlag(): void
  soundColor?: _.Color
  nvui: boolean
}

export type TenthsPref = 0 | 1 | 2;

export interface ClockData {
  running: boolean;
  initial: Seconds;
  increment: Seconds;
  white: Seconds;
  black: Seconds;
  emerg: Seconds;
  showTenths: TenthsPref;
  moretime: number;
}

interface Times {
  white: Millis;
  black: Millis;
  activeColor?: _.Color;
  lastUpdate: Millis;
}

export type ColorMap<T> = { [C in _.Color]: T };

export interface ClockElements {
  time?: HTMLElement;
  clock?: HTMLElement;
}

interface EmergSound {
  play(): void;
  next?: number;
  delay: Millis,
  playable: {
    white: boolean;
    black: boolean;
  };
}

export class ClockController {

  //警告音
  emergSound: EmergSound = {
    play: null,//window.lichess.sound.lowtime,
    delay: 20000,
    playable: {
      white: true,
      black: true
    }
  };

  showTenths: (millis: Millis) => boolean;
  times: Times;

  timeRatioDivisor: number
  emergMs: Millis;

  elements = {
    white: {},
    black: {}
  } as ColorMap<ClockElements>;

  private tickCallback?: number;


  constructor(d: RoundData, readonly opts: ClockOpts, c_el: ColorMap<ClockElements>) {
    const cdata = d.clock!;

    this.elements = c_el;
    // 0.1秒単位で時間表示するかどうか ⇒ showTenths = 1
    //cdata.showTenths = 1;
    const cutoff = cdata.showTenths === 1 ? 10000 : 3600000;
    this.showTenths = (time) => time < cutoff;

    /*
    if (cdata.showTenths === 0) this.showTenths = () => false;
    else {
      const cutoff = cdata.showTenths === 1 ? 10000 : 3600000;
      this.showTenths = (time) => time < cutoff;
    }
    */
    this.emergMs = 1000 * Math.min(60, Math.max(10, cdata.initial * .125));

    this.setClock(d, cdata.white, cdata.black);
    console.log(this.elements)
    renderClock(this, d.player, this.elements[d.player.color].time)
    renderClock(this, d.opponent, this.elements[d.opponent.color].time)
  }

  //時間比率？
  timeRatio = (millis: number): number =>
    Math.min(1, millis * this.timeRatioDivisor);

  //clock設定
  setClock = (d: RoundData, white: Seconds, black: Seconds, delay: Centis = 0) => {
    const isClockRunning = game.playable(d) && (game.playedTurns(d) > 1 || d.clock!.running),
    delayMs = delay * 10;

    this.times = {
      white: white * 1000,
      black: black * 1000,
      activeColor: isClockRunning ? d.game.player : undefined,
      lastUpdate: performance.now() + delayMs
    };
    if (isClockRunning) this.scheduleTick(this.times[d.game.player], delayMs);
  };

  //時間を増やす
  addTime = (color: _.Color, time: Centis): void => {
    this.times[color] += time * 10
  }

  //時間を止める
  stopClock = (): Millis|void => {
    const color = this.times.activeColor;
    if (color) {
      const curElapse = this.elapsed();
      this.times[color] = Math.max(0, this.times[color] - curElapse);
      this.times.activeColor = undefined;
      return curElapse;
    }
  }

  //時間ストップのハード版？
  hardStopClock = (): void => this.times.activeColor = undefined;

  private scheduleTick = (time: Millis, extraDelay: Millis) => {
    if (this.tickCallback !== undefined) clearTimeout(this.tickCallback);
    this.tickCallback = window.setTimeout(
      this.tick,
      // changing the value of active node confuses the chromevox screen reader
      // so update the clock less often
      this.opts.nvui ? 1000 : time % (this.showTenths(time) ? 100 : 500) + 1 + extraDelay);
  }

  // Should only be invoked by scheduleTick.
  private tick = (): void => {
    this.tickCallback = undefined;

    const color = this.times.activeColor;
    if (color === undefined) return;

    const now = performance.now();
    const millis = Math.max(0, this.times[color] - this.elapsed(now));

    this.scheduleTick(millis, 0);
    if (millis === 0) this.opts.onFlag();
    else updateElements(this, this.elements[color], millis);

    if (this.opts.soundColor === color) {
      if (this.emergSound.playable[color]) {
        if (millis < this.emergMs && !(now < this.emergSound.next!)) {
          this.emergSound.play();
          this.emergSound.next = now + this.emergSound.delay;
          this.emergSound.playable[color] = false;
        }
      } else if (millis > 1.5 * this.emergMs) {
        this.emergSound.playable[color] = true;
      }
    }
  };

  elapsed = (now = performance.now()) => Math.max(0, now - this.times.lastUpdate);

  millisOf = (color: _.Color): Millis => (this.times.activeColor === color ?
     Math.max(0, this.times[color] - this.elapsed()) :
     this.times[color]
  );

  isRunning = () => this.times.activeColor !== undefined;
}
