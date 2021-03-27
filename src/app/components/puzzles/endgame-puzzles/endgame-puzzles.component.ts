import { Component, OnInit } from '@angular/core';
import { endgame_checkmates } from 'data/endgame_checkmates.json';
import { queen_endgames } from 'data/queen_endgames.json';
import { pawn_endgames } from 'data/pawn_endgames.json';
import { Puzzle } from 'src/app/lib/interface.library';
import { parseLichessStudies } from 'src/app/lib/util.library';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-endgame-puzzles',
    templateUrl: './endgame-puzzles.component.html',
    styleUrls: ['./endgame-puzzles.component.css']
})
export class EndgamePuzzlesComponent implements OnInit {
    private _endgamePuzzles: Puzzle[];
    private _endgameSet: string;
    private studyObjects = {
        endgame_checkmates,
        queen_endgames,
        pawn_endgames
    };
    constructor(private route: ActivatedRoute) {
        this.endgamePuzzles = [
            // ...parseLichessStudies(endgame_checkmates),
            // ...parseLichessStudies(queen_endgames),
            // ...parseLichessStudies(pawn_endgames)
        ];

        // console.log('endgamepuzzles', this.endgamePuzzles);
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.endgameSet = params.set;
            this.endgamePuzzles = parseLichessStudies(
                this.studyObjects[this.endgameSet]
            );
        });
    }

    get endgameSet(): string {
        return this._endgameSet;
    }
    set endgameSet(s: string) {
        this._endgameSet = s;
    }
    get endgamePuzzles(): Puzzle[] {
        return this._endgamePuzzles;
    }
    set endgamePuzzles(puzzles: Puzzle[]) {
        this._endgamePuzzles = puzzles;
    }
}
