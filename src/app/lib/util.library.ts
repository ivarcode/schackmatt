import {
    LichessGame,
    LichessStudy,
    LineNode,
    Puzzle
} from './interface.library';

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

export function oppositeColor(c: Color): Color {
    return c ? Color.White : Color.Black;
}

export function colorToString(c: Color): string {
    return c ? 'black' : 'white';
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

export const enum Score {
    loss = 0,
    draw = 0.5,
    win = 1
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

function instanceOfLichessStudy(object: any): object is LichessStudy {
    return 'Event' in object;
}

export function parseLichessStudies(studies: any): Puzzle[] {
    // it is expected the study array be an object with numerically increasing
    // keys that all contain a LichessStudy object
    const puzzles = [];
    for (const study of Object.values(studies)) {
        if (instanceOfLichessStudy(study)) {
            puzzles.push(parseLichessStudy(study));
        }
    }
    return puzzles;
}

export function parseLichessStudy(ls: LichessStudy): Puzzle {
    // TODO more here
    return { FEN: ls.FEN, title: ls.Event, pgn: parsePGN(ls.pgnContent) };
}

export function parseLichessGame(lg: LichessGame): Puzzle {
    // TODO more here
    return null;
}

function parseDrawObjectsString(s: string): any {
    // parse into NOT any
    return;
}

export function parsePGN(pgn: string): LineNode {
    // console.log('parsePGN', pgn);

    // EXAMPLE CONTENT
    // "pgn": "\n1. e4 c5 { [%cal Gg1f3,Gg1e2,Gg1h3] } 2. Nf3
    // { [%csl Gc7,Gb6,Ga5] } 2... Qa5 { The pawn can't play to d4 because
    // it is pinned by the queen on a5 } { [%csl Rd4][%cal Rd2d4,Ga5e1] }
    // (2... Nc6 3. d4) 3. c3 *"

    const lineNode: LineNode = {
        move: null,
        nextNodes: [],
        comment: null,
        draws: null
    };
    let prevNode: LineNode;
    let currNode = lineNode;
    let i = 0;
    while (i < pgn.length) {
        // handle beginning new lines
        if (pgn.charAt(i) === '\n') {
            i++;
        }
        let j = i + 1;
        // determine special case termination char
        let specialCase = null;
        if (pgn.charAt(i) === '(') {
            specialCase = ')';
        } else if (pgn.charAt(i) === '{') {
            specialCase = '}';
        }
        // for the next text segment
        if (!specialCase) {
            // no special case, assuming notation
            while (pgn.charAt(j) !== ' ' && j < pgn.length) {
                // index up to the end of the segment
                j++;
            }
            if (
                pgn.charAt(j - 1) === '.' ||
                pgn.charAt(j - 1) === '*' ||
                pgn.charAt(j - 1) === '↵'
            ) {
                // just a move numba or the termination *
                // TODO add other result (termination) keys here
            } else {
                const nextNode = {
                    move: pgn.substring(i, j),
                    nextNodes: [],
                    comment: null,
                    draws: null
                };
                currNode.nextNodes.push(nextNode);
                prevNode = currNode;
                currNode = nextNode;
            }
        } else {
            while (pgn.charAt(j) !== specialCase && j < pgn.length) {
                // index up to the end of the segment
                j++;
            }
            if (pgn.charAt(j) === '}' && specialCase === '}') {
                // console.log('COMMENT', pgn.substring(i + 2, j - 1));
                if (pgn.charAt(i + 2) === '[') {
                    // draw arrows/circles notation
                    currNode.draws = pgn.substring(i + 2, j - 1);
                } else {
                    // normal comment
                    currNode.comment = pgn.substring(i + 2, j - 1);
                }
                j++;
            } else if (pgn.charAt(j) === ')' && specialCase === ')') {
                // console.log('SIDELINE', pgn.substring(i + 1, j));
                prevNode.nextNodes.push(
                    parsePGN(pgn.substring(i + 1, j)).nextNodes[0]
                );
                j++;
            }
        }
        // console.log('i,j', pgn.substring(i, j));

        // must do this to avoid inf loop
        i = j + 1;
        if (pgn.charAt(i) === ' ') {
            i++;
        }
    }
    return lineNode;
}
