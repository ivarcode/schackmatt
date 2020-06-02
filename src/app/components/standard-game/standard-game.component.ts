import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/lib/game.library';

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
    ngOnInit() {}
    public gameDataEvent(event: string): void {
        console.log('game emit', event);
    }
    public navigationDataEvent(event: string): void {
        console.log('nav emit', event);
    }
    public getGame(): Game {
        return this.game;
    }
}
