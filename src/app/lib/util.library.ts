export const enum PieceType {
    King,
    Queen,
    Bishop,
    Knight,
    Rook,
    Pawn
}

export const enum Color {
    White,
    Black
}

export const enum FILE {
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h
}

export const enum RANK {
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT
}

export function fileToString(file: FILE): string {
    return String.fromCharCode(97 + file);
}

export function randomRank(): RANK {
    return Math.floor(Math.random() * 8);
}
export function randomFile(): FILE {
    return Math.floor(Math.random() * 8);
}
export function randomRankInclusivelyBetween(
    minRank: RANK,
    maxRank: RANK
): RANK {
    return randomNumberInclusivelyBetween(minRank + 0, maxRank + 0);
}
export function randomFileInclusivelyBetween(
    minFile: FILE,
    maxFile: FILE
): FILE {
    return randomNumberInclusivelyBetween(minFile + 0, maxFile + 0);
}
export function randomNumberInclusivelyBetween(
    min: number,
    max: number
): number {
    if (max <= min) {
        console.error(max + ' is not greater than ' + min);
    }
    if (max > 7) {
        console.error(max + ' is too large');
    }
    if (min < 0) {
        console.error(min + ' is too small');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickRandom(array: any[]): any {
    if (array.length === 0) {
        console.error('No content in array.');
    } else if (array.length === 1) {
        return array[0];
    }
    return array[Math.floor(Math.random() * array.length)];
}

export function parseLichessFile(file: any): any {
    console.log('parseLichessFile');

    // console.log('called with ', pgn);
    // console.log('root', root);
    // const game = new Game(root.fen);
    // const positionHistArray = [root.fen];
    // let lastNode = null;
    // let currNode = root;
    // let i = 0;
    // while (i <= pgn.length) {
    //     // if (currNode) {
    //     // console.log(this.getJSONTree(currNode, 1));
    //     // }
    //     let j = i;
    //     while (pgn.charAt(j) !== ' ' && j < pgn.length) {
    //         j++;
    //     }
    //     let a = pgn.substr(i, j - i);
    //     // console.log('[' + a + ']');
    //     // if 1-9
    //     if (
    //         (a.charCodeAt(0) <= 57 && a.charCodeAt(0) >= 49) ||
    //         a.charAt(0) === ' ' ||
    //         a.length === 0
    //     ) {
    //         // just a number or empty space or is EMPTY string, ignore
    //         i = j + 1;
    //         // console.log('skip');
    //     } else if (a === '*') {
    //         i = j + 1;
    //     } else if (a.charCodeAt(0) === 40) {
    //         // console.log('alt line');
    //         // (
    //         let k = i + 1;
    //         let count = 1;
    //         while (k < pgn.length) {
    //             if (pgn.charCodeAt(k) === 40) {
    //                 count++;
    //             } else {
    //                 if (pgn.charCodeAt(k) === 41) {
    //                     if (count === 1) {
    //                         // )
    //                         this.buildAndParsePGN(
    //                             lastNode,
    //                             pgn.substr(i + 1, k - i - 1)
    //                         );
    //                         break;
    //                     } else {
    //                         count--;
    //                     }
    //                 }
    //             }
    //             k++;
    //         }
    //         i = k + 2;
    //         // console.log('i is at ', pgn.substr(i, 5));
    //     } else if (a.charCodeAt(0) === 123) {
    //         // console.log('comment', currNode.options.length);
    //         // {
    //         let k = i + 1;
    //         let count = 1;
    //         while (k < pgn.length) {
    //             if (pgn.charCodeAt(k) === 123) {
    //                 count++;
    //             } else {
    //                 if (pgn.charCodeAt(k) === 125) {
    //                     if (count === 1) {
    //                         // }
    //                         const passPGN = pgn.substr(i + 2, k - i - 3);
    //                         // console.log(
    //                         //     'pgn.substr(i+1,k-i)',
    //                         //     '[' + passPGN + ']'
    //                         // );
    //                         if (currNode.options.length !== 0) {
    //                             currNode.options[
    //                                 currNode.options.length - 1
    //                             ].explanation += passPGN;
    //                         } else {
    //                             currNode.explanation += passPGN;
    //                         }
    //                         break;
    //                     } else {
    //                         count--;
    //                     }
    //                 }
    //             }
    //             k++;
    //         }
    //         i = k + 2;
    //     } else {
    //         // console.log('normal move');
    //         // trimming front and back of ( or )
    //         a.charCodeAt(0) === 40 ? (a = a.substr(1)) : (a = a);
    //         a.charCodeAt(a.length - 1) === 41
    //             ? (a = a.substr(0, a.length - 1))
    //             : (a = a);
    //         // console.log('|' + a + '|');
    //         const classificationObj = this.getClassificationObjectOfMove(a);
    //         // don't make move because doing this is tasking on cpu
    //         // game.makeMove(classificationObj.notation);
    //         positionHistArray.push(game.fen);
    //         const nextNode = {
    //             definingMove: classificationObj.notation,
    //             fen: positionHistArray[positionHistArray.length - 1],
    //             classification: classificationObj.classification,
    //             explanation: classificationObj.classification
    //                 ? moveClassificationKey[classificationObj.classification]
    //                 : '',
    //             options: [],
    //             ticks: 0
    //         };
    //         // add move to options
    //         const alreadyMappedIndex = this.moveMappedToIndex(
    //             currNode,
    //             nextNode.definingMove
    //         );
    //         // -1 identifies it not existing in index
    //         // console.log('added', nextNode);
    //         lastNode = currNode;
    //         if (alreadyMappedIndex === -1) {
    //             currNode.options.push(nextNode);
    //             currNode = currNode.options[currNode.options.length - 1];
    //         } else {
    //             currNode = currNode.options[alreadyMappedIndex];
    //         }
    //         i = j + 1;
    //     }
    // }
    // // console.log('JSON', JSON.stringify(root));
    // return root;
}
