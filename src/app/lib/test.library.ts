import { Game } from './game.library';

export interface Branch {
    definingMove: string;
    fen: string;
    options: Branch[];
}

export class Opening {
    data: Branch;
    constructor(pgn: string) {
        this.data = this.parsePGN(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            pgn
        );
    }
    private parsePGN(initPosition: string, pgn: string): Branch {
        console.log('called');
        let position = initPosition;
        let game = new Game(position);
        let root: Branch;
        let i = 0;
        let HARDSTOP = 0;
        while (i <= pgn.length && HARDSTOP < 200) {
            let j = i;
            // console.log(pgn.charAt(j));
            while (pgn.charAt(j) !== ' ' && j < 25) {
                console.log('iter');
                j++;
                HARDSTOP++;
            }
            console.log(pgn.substr(i, j - i));
            i++;
            HARDSTOP++;
        }
        console.log('done');
        return root;
    }
}

// EXAMPLE
// 1. e4 e5 2. Nf3 Nc6 3. c3 Nf6 (3... d5 4. Qa4) 4. d4 *
