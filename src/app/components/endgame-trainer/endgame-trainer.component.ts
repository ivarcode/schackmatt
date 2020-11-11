import { Component, OnInit } from '@angular/core';
import {
    Color,
    File,
    Game,
    Piece,
    PieceType,
    Rank
} from 'src/app/lib/game.library';
import { GameEvent } from 'src/app/lib/interface.library';

@Component({
    selector: 'app-endgame-trainer',
    templateUrl: './endgame-trainer.component.html',
    styleUrls: ['./endgame-trainer.component.css']
})
export class EndgameTrainerComponent implements OnInit {
    private _game: Game;
    private _interfaceCommand: string;

    constructor() {}

    ngOnInit() {
        // start with an empty board
        let emptyBoardFEN = '8/8/8/8/8/8/8/8 w - - 0 1';
        this._game = new Game(emptyBoardFEN);
        let board = this.game.getBoard();
        // random rank between 3 & 5 inclusive
        let r = Math.floor(Math.random() * 3) + 2;
        let f = Math.floor(Math.random() * 4);
        if (f > 1) {
            f += 4;
        }
        board.insertPiece(
            {
                file: f,
                rank: r
            },
            new Piece(PieceType.Pawn, Color.Black)
        );
        board.insertPiece(
            {
                // calculated position of King
                file: f > 1 ? f - (r + 1) : f + (r + 1),
                rank: r + 1
            },
            new Piece(PieceType.King, Color.White)
        );
        board.insertPiece(
            {
                file: Math.floor(Math.random() * 8),
                rank: r + 3
            },
            new Piece(PieceType.King, Color.Black)
        );
    }

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
