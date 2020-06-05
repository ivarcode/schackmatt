import { Component, Input } from '@angular/core';
import { Game } from 'src/app/lib/game.library';

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.css']
})
export class PageComponent {
    private game: Game;
    private title: string;
    constructor() {
        this.title = 'Working Title';
        this.game = new Game();
    }
    public getGame(): Game {
        return this.game;
    }
    public navigationDataEvent(data: string): void {
        console.log('nav data event function', data);
    }
}
