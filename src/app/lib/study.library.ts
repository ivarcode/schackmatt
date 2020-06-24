import { Game } from './game.library';
import { Branch } from './interface.library';

export class Study {
    data: Branch;
    index: Branch;
    constructor(pgn: string) {
        this.data = null;
        this.buildAndParsePGN(
            this.data,
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            'opening begins here',
            pgn
        );
        this.index = {
            definingMove: null,
            fen: this.data.fen,
            explanation: null,
            options: [this.data]
        };
        console.log('--------');
        console.log('pgn', pgn);
        console.log('data', this.data);
        console.log(this.getJSONTree(this.data, 1));
    }
    private buildAndParsePGN(
        root: Branch,
        initPosition: string,
        explantation: string,
        pgn: string
    ): Branch {
        // console.log('called with ', pgn);
        const game = new Game(initPosition);
        const positionHistArray = [initPosition];
        let currNode = root;
        let i = 0;
        while (i <= pgn.length) {
            // if (currNode) {
            // console.log(this.getJSONTree(currNode, 1));
            // }
            let j = i;
            while (pgn.charAt(j) !== ' ' && j < pgn.length) {
                j++;
            }
            let a = pgn.substr(i, j - i);
            // console.log('[' + a + ']');
            // if 1-9
            if (
                (a.charCodeAt(0) <= 57 && a.charCodeAt(0) >= 49) ||
                a.charAt(0) === ' ' ||
                a.length === 0
            ) {
                // just a number or empty space or is EMPTY string, ignore
                i = j + 1;
                // console.log('skip');
            } else if (a === '*') {
                i = j + 1;
            } else if (a.charCodeAt(0) === 40) {
                // console.log('alt line');
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
                                        positionHistArray[
                                            positionHistArray.length - 2
                                        ],
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
            } else if (a.charCodeAt(0) === 123) {
                // console.log('comment', currNode.options.length);
                // {
                let k = i + 1;
                let count = 1;
                while (k < pgn.length) {
                    if (pgn.charCodeAt(k) === 123) {
                        count++;
                    } else {
                        if (pgn.charCodeAt(k) === 125) {
                            if (count === 1) {
                                // }
                                const passPGN = pgn.substr(i + 2, k - i - 3);
                                // console.log(
                                // 'pgn.substr(i+1,k-i)',
                                // '[' + passPGN + ']'
                                // );
                                if (currNode.options.length !== 0) {
                                    currNode.options[
                                        currNode.options.length - 1
                                    ].explanation = passPGN;
                                } else {
                                    currNode.explanation = passPGN;
                                }
                                break;
                            } else {
                                count--;
                            }
                        }
                    }
                    k++;
                }
                i = k + 2;
            } else {
                // console.log('normal move');
                // trimming front and back of ( or )
                a.charCodeAt(0) === 40 ? (a = a.substr(1)) : (a = a);
                a.charCodeAt(a.length - 1) === 41
                    ? (a = a.substr(0, a.length - 1))
                    : (a = a);
                game.makeMove(a);
                positionHistArray.push(game.getFEN());
                const nextNode = {
                    definingMove: a,
                    fen: positionHistArray[positionHistArray.length - 1],
                    explanation: null,
                    options: []
                };
                if (currNode === null) {
                    currNode = nextNode;
                    // if (root === null) {
                    //     root = currNode;
                    // }
                } else {
                    // if move doesn't exist already
                    if (this.moveExistsOnBranch(currNode, a)) {
                    }
                    if (currNode.options.length !== 0) {
                        // traverse if necessary
                        currNode = currNode.options[0];
                    }
                    // add as move
                    currNode.options.push(nextNode);
                }
                i = j + 1;
            }
        }
        // console.log('JSON', JSON.stringify(root));
        return root;
    }

    // returns whether the tree was successfully traversed by the param move
    // string
    public traverseIndex(move: string): boolean {
        for (const i of this.index.options) {
            if (i.definingMove === move) {
                this.index = i;
                return true;
            }
        }
        return false;
    }

    // returns randomly selected from options tree, else null
    public selectAndTraverseRandomMove(): string {
        if (this.index.options.length !== 0) {
            const i = Math.floor(Math.random() * this.index.options.length);
            const randomMove = this.index.options[i].definingMove;
            this.traverseIndex(randomMove);
            return randomMove;
        }
        return null;
    }

    // prints some nice lookin tree
    private getJSONTree(b: Branch, spaces: number): string {
        let s = '';
        s += b.definingMove + (b.explanation ? ' (' + b.explanation + ')' : '');
        for (const opt of b.options) {
            s += '\n';
            for (let i = 0; i < spaces; i++) {
                s += '  ';
            }
            s += this.getJSONTree(opt, spaces + 1);
        }
        return s;
    }

    // TODO return stems with no explanation
    // do i need this?
    private getBareStems(): number {
        return 0;
    }
}
