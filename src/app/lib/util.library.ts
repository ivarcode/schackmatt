import { File, Rank } from './game.library';

export function fileToString(file: File): string {
    return String.fromCharCode(97 + file);
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
function randomNumberInclusivelyBetween(min: number, max: number): number {
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
