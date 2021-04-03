import { Component, OnInit } from '@angular/core';
import { endgame_checkmates } from 'data/endgame_checkmates.json';
import { queen_endgames } from 'data/queen_endgames.json';
import { pawn_endgames } from 'data/pawn_endgames.json';
import { Puzzle } from 'src/app/lib/interface.library';
import { parseLichessStudies } from 'src/app/lib/util.library';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
    private _lessons: Puzzle[];
    public courseKey: [{}, string][];
    private studyObjects = {
        endgame_checkmates,
        queen_endgames,
        pawn_endgames
    };
    // public courseParamObject: { set: 'pawn_endgames' };

    constructor(private route: ActivatedRoute, private router: Router) {
        this.lessons = [];
        this.courseKey = [
            [{ set: 'endgame_checkmates' }, 'Endgame Checkmates'],
            [{ set: 'pawn_endgames' }, 'Pawn Endgames'],
            [{ set: 'queen_endgames' }, 'Queen Endgames']
        ];
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            // const defaultParamString = 'endgame_checkmates';
            let paramString: string;
            if (!params?.set) {
                // this.router.navigate(['courses'], {
                //     queryParams: { set: defaultParamString }
                // });
                // paramString = defaultParamString;
            } else {
                paramString = params.set;
                this.lessons = parseLichessStudies(
                    this.studyObjects[paramString]
                );
            }
        });
    }

    get lessons(): Puzzle[] {
        return this._lessons;
    }
    set lessons(puzzles: Puzzle[]) {
        this._lessons = puzzles;
    }
}
