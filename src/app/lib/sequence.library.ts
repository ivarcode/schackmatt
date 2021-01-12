import { Game } from './game.library';
import { Move } from './interface.library';
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
     * @description {Move[]} series of moves that defines the Sequence
     */
    private _moves: Move[];

    constructor(initPosition: string, sequence: string, name?: string) {
        this._name = name || null;
        this._initPosition = initPosition;
        let game = new Game(initPosition);

        this._moves = parsePGN(initPosition, sequence);
        console.log('moves parsed', this._moves);
    }

    /**
     * @description gets a Move at a given index
     * @param index - move index
     * @returns move at the index
     */
    public getMove(index: number): Move {
        return this.moves[index];
    }

    get name(): string {
        return this._name;
    }
    get moves(): Move[] {
        return this._moves;
    }
    get initPosition(): string {
        return this._initPosition;
    }
}
