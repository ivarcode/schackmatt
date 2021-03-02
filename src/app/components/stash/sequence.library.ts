import { Move } from '../../lib/interface.library';

/**
 * @description class that defines a specific sequence of moves by storing
 * a starting position and a sequence of moves in string format (move notation)
 */
export class Sequence {
    /**
     * @description {string} Sequence title
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
     * @param name - sequence name
     * @param initPosition - starting position FEN
     * @param sequence - pgn defining the sequence
     */
    constructor(name: string, initPosition: string, sequence: string) {
        this._name = name;
        this._initPosition = initPosition;
        // this._moves = parsePGN(initPosition, sequence);
    }

    /**
     * @description returns the move immediately following the last move in the
     * sequence param
     * @param moveHistory - list of moves to parse through
     */
    public getMoveFollowing(moveHistory: Move[]): string {
        let index = 0;
        let syncedWithLine = true;
        for (const m of moveHistory) {
            if (m.notation === this.moves[index]) {
                index++;
                syncedWithLine = true;
            } else {
                syncedWithLine = false;
            }
        }
        return syncedWithLine ? this.moves[index] : null;
    }

    /**
     * @description performs a loop to determine if the param sequence matches
     * the move sequence of the Sequence object
     * @param moveHistory - series of moves to compare to the sequence
     */
    public matches(moveHistory: Move[]): boolean {
        for (let i = 0; i < this.moves.length; i++) {
            if (!moveHistory[i] || moveHistory[i].notation !== this.moves[i]) {
                return false;
            }
        }
        return true;
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
