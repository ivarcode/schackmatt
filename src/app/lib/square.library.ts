import { FILE, RANK, fileToString } from './util.library';

export class Square {
    private _file: FILE;
    private _rank: RANK;
    constructor(file: FILE, rank: RANK) {
        this._file = file;
        this._rank = rank;
    }
    public toString(): string {
        return fileToString(this.file) + (this.rank + 1);
    }
    public isCloserToCenterThan(sq: Square) {
        let selfDist = Math.abs(this.file - 3.5) + Math.abs(this.rank - 3.5);
        let sqDist = Math.abs(sq.file - 3.5) + Math.abs(sq.rank - 3.5);
        return selfDist < sqDist;
    }
    get file(): FILE {
        return this._file;
    }
    get rank(): RANK {
        return this._rank;
    }
}
