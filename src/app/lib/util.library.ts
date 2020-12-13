import { File } from './game.library';

export function fileToString(file: File): string {
    return String.fromCharCode(97 + file);
}
