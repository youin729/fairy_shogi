
import { Chessground } from 'chessground/chessground';

const config = {
    movable: {
        free: false,
    }
}

Chessground(document.getElementById("app"), config);