import RoundController from './index';
import * as _ from './common/type';
import { Untyped } from './interfaces';

import * as io from "socket.io-client";

interface Handlers {
  [key: string]: (data: any) => void;
}

export interface RoundSocket{
  send: _.SocketSend;
  handlers: Untyped;
  receive(typ: string, data: any): boolean;
}

export function make(send: _.SocketSend, ctrl: RoundController): RoundSocket {

  /*
  function reload(o: Incoming, isRetry?: boolean) {
    // avoid reload if possible!
    if (o && o.t) {
      ctrl.setLoading(false);
      handlers[o.t](o.d);
    }
    else xhr.reload(ctrl).then(data => {
      if (li.socket.getVersion() > data.player.version) {
        // race condition! try to reload again
        if (isRetry) li.reload(); // give up and reload the page
        else reload(o, true);
      }
      else ctrl.reload(data);
    });
  };
*/
  const handlers: Handlers = {
    /*
    takebackOffers(o) {
      ctrl.setLoading(false);
      ctrl.data.player.proposingTakeback = o[ctrl.data.player.color];
      const fromOp = ctrl.data.opponent.proposingTakeback = o[ctrl.data.opponent.color];
      ctrl.redraw();
    },
    */
   //move: ctrl.apiMove,
    //drop: ctrl.apiMove,
    //reload,
    /*
    redirect: ctrl.setRedirecting,
    clockInc(o) {
      if (ctrl.clock) {
        ctrl.clock.addTime(o.color, o.time);
        ctrl.redraw();
      }
    },
    cclock(o) {
      if (ctrl.corresClock) {
        ctrl.data.correspondence.white = o.white;
        ctrl.data.correspondence.black = o.black;
        ctrl.corresClock.update(o.white, o.black);
        ctrl.redraw();
      }
    },
    crowd(o) {
      game.setOnGame(ctrl.data, 'white', o['white']);
      game.setOnGame(ctrl.data, 'black', o['black']);
      ctrl.redraw();
    },
    endData: ctrl.endWithData,
    rematchOffer(by: Color) {
      ctrl.data.player.offeringRematch = by === ctrl.data.player.color;
      if (ctrl.data.opponent.offeringRematch = by === ctrl.data.opponent.color)
        notify(ctrl.noarg('yourOpponentWantsToPlayANewGameWithYou'));
      ctrl.redraw();
    },
    rematchTaken(nextId: string) {
      ctrl.data.game.rematch = nextId;
      if (!ctrl.data.player.spectator) ctrl.setLoading(true);
      else ctrl.redraw();
    },
    drawOffer(by) {
      ctrl.data.player.offeringDraw = by === ctrl.data.player.color;
      const fromOp = ctrl.data.opponent.offeringDraw = by === ctrl.data.opponent.color;
      if (fromOp) notify(ctrl.noarg('yourOpponentOffersADraw'));
      ctrl.redraw();
    },
    berserk(color: Color) {
      ctrl.setBerserk(color);
    },
    gone: ctrl.setGone,
    goneIn: ctrl.setGone,
    checkCount(e) {
      ctrl.data.player.checks = ctrl.data.player.color == 'white' ? e.white : e.black;
      ctrl.data.opponent.checks = ctrl.data.opponent.color == 'white' ? e.white : e.black;
      ctrl.redraw();
    },
    simulPlayerMove(gameId: string) {
      if (
        ctrl.opts.userId &&
        ctrl.data.simul &&
        ctrl.opts.userId == ctrl.data.simul.hostId &&
        gameId !== ctrl.data.game.id &&
        ctrl.moveOn.get() &&
        !isPlayerTurn(ctrl.data)) {
        ctrl.setRedirecting();
        sound.move();
        li.hasToReload = true;
        location.href = '/' + gameId;
      }
    },
    simulEnd(simul: game.Simul) {
      li.loadCssPath('modal');
      $.modal($(
        '<p>Simul complete!</p><br /><br />' +
        '<a class="button" href="/simul/' + simul.id + '">Back to ' + simul.name + ' simul</a>'
      ));
    }
    */
  };

  //li.pubsub.on('ab.rep', n => send('rep', { n }));

  return {
    send,
    handlers,
    /*
    moreTime: throttle(300, () => send('moretime')),
    outoftime: backoff(500, 1.1, () => send('flag', ctrl.data.game.player)),
    berserk: throttle(200, () => send('berserk', null, { ackable: true })),
    sendLoading(typ: string, data?: any) {
      ctrl.setLoading(true);
      send(typ, data);
    },
    */
    receive(typ: string, data: any): boolean {
      if (handlers[typ]) {
        handlers[typ](data);
        return true;
      }
      return false;
    },
    //reload
  };
}
