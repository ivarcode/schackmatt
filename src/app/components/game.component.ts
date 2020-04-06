import { Component } from '@angular/core';
import { Game } from '../lib/game.library';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent {
    private game: Game;

    constructor() {
        this.game = new Game();
        console.log(this.game);
    }
}
