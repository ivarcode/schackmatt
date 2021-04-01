import { Component, OnInit } from '@angular/core';
import { endgame_checkmates } from 'data/endgame_checkmates.json';
import { queen_endgames } from 'data/queen_endgames.json';
import { pawn_endgames } from 'data/pawn_endgames.json';
import { Puzzle } from 'src/app/lib/interface.library';
import { parseLichessStudies } from 'src/app/lib/util.library';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-endgame-puzzles',
    templateUrl: './endgame-puzzles.component.html',
    styleUrls: ['./endgame-puzzles.component.css']
})
export class EndgamePuzzlesComponent implements OnInit {
    private _endgamePuzzles: Puzzle[];
    private studyObjects = {
        endgame_checkmates,
        queen_endgames,
        pawn_endgames
    };
    // public endgamePuzzleParamObject: { set: 'pawn_endgames' };

    constructor(private route: ActivatedRoute, private router: Router) {
        this.endgamePuzzles = [
            // ...parseLichessStudies(endgame_checkmates),
            // ...parseLichessStudies(queen_endgames),
            // ...parseLichessStudies(pawn_endgames)
        ];

        // console.log('endgamepuzzles', this.endgamePuzzles);
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            const defaultParamString = 'endgame_checkmates';
            let paramString: string;
            if (!params?.set) {
                this.router.navigate(['endgame_puzzles'], {
                    queryParams: { set: defaultParamString }
                });
                paramString = defaultParamString;
            } else {
                paramString = params.set;
            }
            this.endgamePuzzles = parseLichessStudies(
                this.studyObjects[paramString]
            );
        });
    }

    get endgamePuzzles(): Puzzle[] {
        return this._endgamePuzzles;
    }
    set endgamePuzzles(puzzles: Puzzle[]) {
        this._endgamePuzzles = puzzles;
    }
}
