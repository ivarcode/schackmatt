import { Component } from '@angular/core';
import { basic_checkmates } from 'data/basic_checkmates.json';
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
        this.endgamePuzzles = parseLichessStudies(basic_checkmates);
        // console.log('endgamepuzzles', this.endgamePuzzles);
    }
    get endgamePuzzles(): Puzzle[] {
        return this._endgamePuzzles;
    }
    set endgamePuzzles(puzzles: Puzzle[]) {
        this._endgamePuzzles = puzzles;
    }
}
