import { Game } from './game.library';

export class Opening {
    data: {};
    constructor(pgn: string) {
        this.data = this.parsePGN(
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            pgn
        );
    }
    private parsePGN(initPosition: string, pgn: string): {} {
        let position = initPosition;
        let game = new Game(position);
        let data = {};

        return data;
    }
}

// EXAMPLE
// 1. e4 e5 2. Nf3 Nc6 3. c3 Nf6 (3... d5 4. Qa4) 4. d4 *
