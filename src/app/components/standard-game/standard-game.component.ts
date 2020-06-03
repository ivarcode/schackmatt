import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/lib/game.library';
import { Opening } from 'src/app/lib/test.library';

@Component({
    selector: 'app-standard-game',
    templateUrl: './standard-game.component.html',
    styleUrls: ['./standard-game.component.css']
})
export class StandardGameComponent implements OnInit {
    private game: Game;

    constructor() {
        this.game = new Game();
    }
    ngOnInit() {
        let opening = new Opening(
            '1. e4 e5 2. Nf3 Nc6 3. c3 Nf6 (3... d5 4. Qa4) 4. d4 *'
        );
        console.log('print da opening in JSON here ');
    }
    // public gameDataEvent(event: string): void {
    //     console.log('game emit', event);
    // }
    public navigationDataEvent(event: string): void {
        console.log('nav emit', event);
    }
    public getGame(): Game {
        return this.game;
    }
}
