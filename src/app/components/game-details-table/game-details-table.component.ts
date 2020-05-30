import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector: 'app-game-details-table',
    templateUrl: './game-details-table.component.html',
    styleUrls: ['./game-details-table.component.css']
})
export class GameDetailTableComponent implements OnChanges {
    @Input() pgn: string;
    private pgnArray: any[];

    constructor() {
        this.pgnArray = [];
    }

    // ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        console.log('changes', changes);

        // TODO check if pgn changed
        this.constructPGNArray();
        console.log(this.pgnArray);
    }

    private constructPGNArray(): void {
        this.pgnArray = [];
        if (this.pgn) {
            const split = this.pgn.split(' ');
            // console.log('split', split);
            for (let i = 0; i < split.length; i++) {
                let n = null;
                let w = null;
                let b = null;
                if (i < split.length) {
                    n = split[i];
                }
                if (i + 1 < split.length) {
                    w = split[i + 1];
                }
                if (i + 2 < split.length) {
                    b = split[i + 2];
                }
                if (n !== null || n !== undefined) {
                    this.pgnArray.push({
                        number: n,
                        white: w,
                        black: b
                    });
                }
                i += 2;
            }
        }
    }

    public getPGNArray(): any[] {
        return this.pgnArray;
    }
}
