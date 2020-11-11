import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/lib/game.library';
import { GameEvent } from 'src/app/lib/interface.library';

@Component({
    selector: 'app-endgame-trainer',
    templateUrl: './endgame-trainer.component.html',
    styleUrls: ['./endgame-trainer.component.css']
})
export class EndgameTrainerComponent implements OnInit {
    private _game: Game;
    private _interfaceCommand: string;

    constructor() {
        this._game = new Game();
    }

    ngOnInit() {}

    public gameDataEvent(event: GameEvent) {
        console.log(event);
    }

    get game(): Game {
        return this._game;
    }
    get interfaceCommand(): string {
        return this._interfaceCommand;
    }
}
