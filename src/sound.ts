import throttle from './common/throttle';

let sound = new Array();
sound["move"] = new Audio();
sound["move"].src = '/public/sound/standard/Move.mp3';

sound["capture"] = new Audio();
sound["capture"].src = '/public/sound/standard/Capture.mp3';

sound["check"] = new Audio();
sound["check"].src = '/public/sound/standard/Check.mp3';

function throttled(opts?: string): () => void {
  return throttle(100, () => sound[opts].play())
}

export const move = throttled('move');
export const capture = throttled('capture');
export const check = throttled('check');
