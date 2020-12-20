import { File, Rank } from './game.library';
import { fileToString } from './util.library';

export class Square {
    private _file: File;
    private _rank: Rank;
    constructor(file: File, rank: Rank) {
        this._file = file;
        this._rank = rank;
    }
    public toString(): string {
        return fileToString(this.file) + (this.rank + 1);
    }
    get file(): File {
        return this._file;
    }
    get rank(): Rank {
        return this._rank;
    }
}
