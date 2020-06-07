import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/lib/game.library';
import { Opening } from 'src/app/lib/opening.library';
import { GameEvent } from 'src/app/lib/interface.library';

@Component({
    selector: 'app-opening-training-game',
    templateUrl: './opening-training-game.component.html',
    styleUrls: ['./opening-training-game.component.css']
})
export class OpeningTrainingGameComponent implements OnInit {
    private game: Game;
    private opening: Opening;

    constructor() {
        this.game = new Game();
    }
    ngOnInit() {
        this.opening = new Opening(
            // '1. e4 e5 2. Nf3 Nc6 3. c3 Nf6 (3... d5 4. Qa4) 4. d4 *'
            // '1. e4 d5 2. exd5 Qxd5 3. Nc3 { test comment } 3... Qd8 4. Nf3 Bg4 5. d4 (5. Bc4 Qxd2+ 6. Bxd2 Nc6 (6... Bxf3 7. Qxf3 e5 8. O-O-O Bb4) 7. O-O O-O-O) *'
            // '1. e4 d5 (1... e5)  (1... f5)  (1... c5)  (1... b5) *'
            '1. e4 { bop } d5 { d5c } (1... e5 { e5c }) 2. exd5 c6 3. dxc6 { herp } (3. Nf3 { derp }) *'
        );
    }
    public navigationDataEvent(event: string): void {
        console.log('nav emit', event);
    }
    public gameDataEvent(event: GameEvent): void {
        console.log('game emit', event);
        if (event.type === 'move') {
            if (!this.opening.traverseIndex(event.content)) {
                throw Error('your move was not very good');
            }
            // 1 second timeout
            // setTimeout(() => {
            const randomMove = this.opening.selectAndTraverseRandomMove();
            if (randomMove !== null) {
                this.game.makeMove(randomMove);
            }
            // }, 1000);
        }
    }
    public getGame(): Game {
        return this.game;
    }
}
