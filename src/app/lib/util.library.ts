import { File, Square } from './game.library';

export function fileToString(file: File): string {
    return String.fromCharCode(97 + file);
}

export function squareToString(sq: Square): string {
    return fileToString(sq.file) + (sq.rank + 1);
}
