import { Component } from '@angular/core';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent {
    private game: {
        fen: string;
        pgn: string;
    };

    console.log(game);
}
