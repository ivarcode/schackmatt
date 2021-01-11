import { Move } from './interface.library';

export class Sequence {
    private _moves: Move[];
    constructor(moves: Move[]) {
        this._moves = moves;
    }

    public getMove(index: number): Move {
        return this.moves[index];
    }

    get moves(): Move[] {
        return this._moves;
    }
}
