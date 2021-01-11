import { Move } from './interface.library';

export class Sequence {
    /**
     * @description {string} Sequence title (optional)
     */
    private _name: string;
    /**
     * @description {Move[]} series of moves that defines the Sequence
     */
    private _moves: Move[];

    constructor(moves: Move[], name?: string) {
        this._name = name || null;
        this._moves = moves;
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
}
