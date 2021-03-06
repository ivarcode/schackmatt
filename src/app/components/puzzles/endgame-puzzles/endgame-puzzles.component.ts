import { Component } from '@angular/core';
import { endgame_checkmates } from 'data/endgame_checkmates.json';
import { queen_endgames } from 'data/queen_endgames.json';
import { pawn_endgames } from 'data/pawn_endgames.json';
import { Puzzle } from 'src/app/lib/interface.library';
import { parseLichessStudies } from 'src/app/lib/util.library';

@Component({
    selector: 'app-endgame-puzzles',
    templateUrl: './endgame-puzzles.component.html',
    styleUrls: ['./endgame-puzzles.component.css']
})
export class EndgamePuzzlesComponent {
    private _endgamePuzzles: Puzzle[];
    constructor() {
        this.endgamePuzzles = [
            ...parseLichessStudies(endgame_checkmates),
            ...parseLichessStudies(queen_endgames),
            ...parseLichessStudies(pawn_endgames)
        ];
        // console.log('endgamepuzzles', this.endgamePuzzles);
    }
    get endgamePuzzles(): Puzzle[] {
        return this._endgamePuzzles;
    }
    set endgamePuzzles(puzzles: Puzzle[]) {
        this._endgamePuzzles = puzzles;
    }
}
