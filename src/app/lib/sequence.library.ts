import { parsePGN } from './util.library';

/**
 * @description class that defines a specific sequence of moves by storing
 * a starting position and a sequence of moves in string format (move notation)
 */
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

    /**
     * @param initPosition - starting position FEN
     * @param sequence - pgn defining the sequence
     * @param name - sequence name (optional)
     */
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
