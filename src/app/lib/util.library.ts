import { File, Square } from './game.library';

export function fileToString(file: File): string {
    return String.fromCharCode(97 + file);
}

export function squareToString(sq: Square): string {
    return this.fileToString(sq.file) + (sq.rank + 1);
}
