import { Game } from './game.library';
import { Branch } from './interface.library';

export const moveClassificationKey = {
    '!': 'Good move',
    '!!': 'Brilliant move',
    '?': 'Mistake',
    '??': 'Blunder',
    '!?': 'Interesting move',
    '?!': 'Dubious move'
};

export class Study {
    private data: Branch;
    private index: Branch;

    // this is not really the opening object, thought this didn't belong
    // at some point though, maybe this could be an optional?
    // private rootOfOpening: Branch;

    constructor(pgnArray: string[]) {
        this.data = {
            definingMove: null,
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            explanation: 'HEAD',
            options: []
        };
        // parse all PGN content
        for (const pgn of pgnArray) {
            // console.log('build :: [', pgn, ']');
            this.buildAndParsePGN(this.data, pgn);
        }
        this.index = this.data;
        console.log('--------');
        // console.log('pgn', pgnArray);
        console.log('data', this.data);
        // console.log('index', this.index);
        console.log(this.getJSONTree(this.data, 1));
        console.log('total moves in study :: ', this.getTotalMoves(this.data));
    }

    private getTotalMoves(branch: Branch): number {
        let totalMoves = 1;
        for (const o of branch.options) {
            totalMoves += this.getTotalMoves(o);
        }
        return totalMoves;
    }

    private buildAndParsePGN(root: Branch, pgn: string): Branch {
        // console.log('called with ', pgn);
        // console.log('root', root);
        const game = new Game(root.fen);
        const positionHistArray = [root.fen];
        let lastNode = null;
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
                                this.buildAndParsePGN(
                                    lastNode,
                                    pgn.substr(i + 1, k - i - 1)
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
                                console.log(
                                    'pgn.substr(i+1,k-i)',
                                    '[' + passPGN + ']'
                                );
                                if (currNode.options.length !== 0) {
                                    currNode.options[
                                        currNode.options.length - 1
                                    ].explanation += passPGN;
                                } else {
                                    currNode.explanation += passPGN;
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
                console.log('|' + a + '|');
                const classificationObj = this.getClassificationObjectOfMove(a);
                game.makeMove(classificationObj.notation);
                positionHistArray.push(game.getFEN());
                const nextNode = {
                    definingMove: classificationObj.notation,
                    fen: positionHistArray[positionHistArray.length - 1],
                    explanation: classificationObj.classification
                        ? moveClassificationKey[
                              classificationObj.classification
                          ]
                        : '',
                    options: []
                };
                // add move to options
                const alreadyMappedIndex = this.moveMappedToIndex(
                    currNode,
                    nextNode.definingMove
                );
                // -1 identifies it not existing in index
                // console.log('added', nextNode);
                lastNode = currNode;
                if (alreadyMappedIndex === -1) {
                    currNode.options.push(nextNode);
                    currNode = currNode.options[currNode.options.length - 1];
                } else {
                    currNode = currNode.options[alreadyMappedIndex];
                }
                i = j + 1;
            }
        }
        // console.log('JSON', JSON.stringify(root));
        return root;
    }

    private getClassificationObjectOfMove(
        notationParam: string
    ): { notation: string; classification: string } {
        for (let i = 0; i < notationParam.length; i++) {
            const c = notationParam.charAt(i);
            if (c === '?' || c === '!') {
                return {
                    notation: notationParam.substr(0, i),
                    classification: notationParam.substr(i)
                };
            }
        }
        return {
            notation: notationParam,
            classification: null
        };
    }

    // returns if move already exists on branch in options
    // if not, returns null
    public moveMappedToIndex(node: Branch, move: string): number {
        for (
            let optionIndex = 0;
            optionIndex < node.options.length;
            optionIndex++
        ) {
            if (node.options[optionIndex].definingMove === move) {
                return optionIndex;
            }
        }
        // not mapped in index
        return -1;
    }

    // returns whether the tree was successfully traversed by the param move
    // string
    public traverseIndex(move: string): boolean {
        for (const i of this.index.options) {
            if (i.definingMove === move) {
                this.index = i;
                // console.log('traversed');
                console.log(this.getOptionsFromBranch(this.getIndex()));
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

    public getOptionsFromBranch(branch: Branch): string {
        let s = 'after ' + branch.definingMove + ' options :: ';
        for (const o of branch.options) {
            s += o.definingMove + ' ';
        }
        return s;
    }

    public setIndex(branch: Branch): void {
        this.index = branch;
    }

    public getIndex(): Branch {
        return this.index;
    }

    // TODO return stems with no explanation
    // do i need this?
    private getBareStems(): number {
        return 0;
    }
}
