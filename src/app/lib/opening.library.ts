import { Game } from './game.library';
import { Branch } from './interface.library';

export class Opening {
    data: Branch;

    arr = [];
    constructor(pgn: string) {
        this.data = this.parsePGN(
            null,
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            pgn
        );
        console.log('--------');
        console.log(this.getJSONTree(this.data, 1));
    }
    private parsePGN(root: Branch, initPosition: string, pgn: string): Branch {
        console.log('called with ', pgn);
        let position = initPosition;
        let game = new Game(position);
        let currNode = root;
        let i = 0;
        while (i <= pgn.length) {
            // console.log('currnode', currNode);
            let j = i;
            while (pgn.charAt(j) !== ' ' && j < pgn.length) {
                // console.log('iter');
                j++;
            }
            let a = pgn.substr(i, j - i);
            console.log('[' + a + ']');
            // if 1-9
            if (
                (a.charCodeAt(0) <= 57 && a.charCodeAt(0) >= 49) ||
                a.charAt(0) === ' ' ||
                a.length === 0
            ) {
                // just a number or empty space or is EMPTY string, ignore
                i = j + 1;
                console.log('skip');
            } else if (a === '*') {
                i = j + 1;
                // console.log('* indicating end character');
            } else if (a.charCodeAt(0) === 40) {
                console.log('alt line');
                // (
                let k = i + 1;
                let count = 1;
                while (k < pgn.length) {
                    if (pgn.charCodeAt(k) === 40) {
                        count++;
                    } else {
                        if (pgn.charCodeAt(k) === 41) {
                            if (count === 1) {
                                // )
                                currNode.options.push(
                                    this.parsePGN(
                                        null,
                                        null,
                                        pgn.substr(i + 1, k - i)
                                    )
                                );
                                break;
                            } else {
                                count--;
                            }
                        }
                    }
                    k++;
                }
                i = k + 2;
                // console.log('i is at ', pgn.substr(i, 5));
            } else {
                console.log('normal move');
                // trimming front and back of ( or )
                a.charCodeAt(0) === 40 ? (a = a.substr(1)) : (a = a);
                a.charCodeAt(a.length - 1) === 41
                    ? (a = a.substr(0, a.length - 1))
                    : (a = a);
                const nextNode = {
                    definingMove: a,
                    fen: null,
                    options: []
                };
                if (currNode === null) {
                    console.log('A');
                    currNode = nextNode;
                    if (root === null) {
                        root = currNode;
                    }
                } else {
                    if (currNode.options.length !== 0) {
                        // traverse if necessary
                        currNode = currNode.options[0];
                    }
                    console.log('B');
                    // add as move
                    currNode.options.push(nextNode);
                }
                i = j + 1;
            }
        }
        console.log('done', root);
        // console.log('JSON', JSON.stringify(root));
        return root;
    }
    private getJSONTree(b: Branch, spaces: number): string {
        let s = '';
        s += b.definingMove;
        if (b.options.length > 1) {
            this.arr.push(spaces);
        }
        for (const opt of b.options) {
            s += '\n';
            for (let i = 0; i < spaces; i++) {
                if (this.arr.includes(i)) {
                    s += '| ';
                } else {
                    s += '  ';
                }
            }
            s += this.getJSONTree(opt, spaces + 1);
        }
        return s;
    }
}
