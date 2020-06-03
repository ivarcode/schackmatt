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
            this.data,
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            pgn
        );
        console.log(this.getJSONTree(this.data, 1));
    }
    private parsePGN(root: Branch, initPosition: string, pgn: string): Branch {
        console.log('called');
        let position = initPosition;
        let game = new Game(position);
        root = { definingMove: null, fen: initPosition, options: [] };
        let currNode = root;
        let i = 0;
        while (i <= pgn.length) {
            let j = i;
            console.log(pgn.charAt(j));
            while (pgn.charAt(j) !== ' ' && j < pgn.length) {
                // console.log('iter');
                j++;
            }
            let a = pgn.substr(i, j - i);
            console.log('[' + a + ']');
            // if 1-9
            if (a.charCodeAt(0) <= 57 && a.charCodeAt(0) >= 49) {
                // just a number, ignore
            } else if (a.charCodeAt(0) === 40) {
                // (
                console.log('i is curr', pgn.charAt(i));
                let k = i + 1;
                while (k < pgn.length) {
                    console.log('entering garbage');
                    if (pgn.charCodeAt(k) === 41) {
                        // )
                        currNode.options.push(
                            this.parsePGN(
                                currNode,
                                null,
                                pgn.substr(i + 1, k - i)
                            )
                        );
                        break;
                    }
                    k++;
                }
            } else {
                // add as move
                currNode.definingMove = a;
                currNode.options.push({
                    definingMove: null,
                    fen: null,
                    options: []
                });
                currNode = currNode.options[0];
            }
            i = j + 1;
        }
        console.log('done', root);
        // console.log('JSON', JSON.stringify(root));
        return root;
    }
    private getJSONTree(b: Branch, spaces: number): string {
        let s = '';
        s += b.definingMove;
        for (let opt of b.options) {
            s += '\n';
            for (let i = 0; i < spaces; i++) {
                s += ' ';
            }
            s += this.getJSONTree(opt, spaces + 1);
        }
        return s;
    }
}

// EXAMPLE
// 1. e4 e5 2. Nf3 Nc6 3. c3 Nf6 (3... d5 4. Qa4) 4. d4 *
