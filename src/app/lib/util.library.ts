import { File, Game, Rank } from './game.library';
import { Move } from './interface.library';

export function fileToString(file: File): string {
    return String.fromCharCode(97 + file);
}

export function parsePGN(initPosition: string, pgn: string): string[] {
    const moves: string[] = [];
    let i = 0;
    while (i < pgn.length) {
        let j = i;
        while (pgn.charAt(j) !== ' ' && j < pgn.length) {
            j++;
        }
        const a = pgn.substr(i, j - i);
        // if 1-9 or *
        if (
            !(
                (a.charCodeAt(0) <= 57 && a.charCodeAt(0) >= 49) ||
                a.charAt(0) === ' ' ||
                a.length === 0 ||
                a === '*'
            )
        ) {
            moves.push(a);
        }
        i = j + 1;
    }
    return moves;
}

export function randomRank(): Rank {
    return Math.floor(Math.random() * 8);
}
export function randomFile(): File {
    return Math.floor(Math.random() * 8);
}
export function randomRankInclusivelyBetween(
    minRank: Rank,
    maxRank: Rank
): Rank {
    return randomNumberInclusivelyBetween(minRank + 0, maxRank + 0);
}
export function randomFileInclusivelyBetween(
    minFile: File,
    maxFile: File
): File {
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
