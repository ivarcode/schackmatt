import { parsePGN } from './util.library';

export class Sequence {
    /**
     * @description {string} Sequence title (optional)
     */
    private _name: string;
    /**
     * @description starting position of the sequence in fen format
     */
    private _initPosition: string;
    /**
     * @description {string[]} series of moves (notation) that defines the
     * Sequence
     */
    private _moves: string[];

    constructor(initPosition: string, sequence: string, name?: string) {
        this._name = name || null;
        this._initPosition = initPosition;
        this._moves = parsePGN(initPosition, sequence);
    }

    get name(): string {
        return this._name;
    }
    get moves(): string[] {
        return this._moves;
    }
    get initPosition(): string {
        return this._initPosition;
    }
}
