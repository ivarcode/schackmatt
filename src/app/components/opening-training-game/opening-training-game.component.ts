import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/lib/game.library';
import { Study } from 'src/app/lib/study.library';
import { GameEvent } from 'src/app/lib/interface.library';
import { Openings } from 'src/app/data/openings';

@Component({
    selector: 'app-opening-training-game',
    templateUrl: './opening-training-game.component.html',
    styleUrls: ['./opening-training-game.component.css']
})
export class OpeningTrainingGameComponent implements OnInit {
    private game: Game;
    private opening: Study;
    private gameInterfaceCommand: string;
    private alertType: string;
    private choiceHeadingMessage: string;
    private choiceQuote: string;
    private choiceAuthor: string;

    constructor() {
        this.game = new Game();
    }
    ngOnInit() {
        // TODO pass in opening as OBJECT
        this.opening = new Study(Openings.openings[0].pgnData);
        this.alertType = 'alert-warning';
        this.choiceHeadingMessage = 'no message';
        this.choiceAuthor = '';
        this.choiceQuote = '';
    }
    public navigationDataEvent(event: string): void {
        console.log('nav emit', event);
        if (event === 'forward' || event === 'back') {
            this.triggerGameInterfaceCommand(event);
        }
    }
    public gameDataEvent(event: GameEvent): void {
        console.log('game emit', event);
        if (event.type === 'move') {
            this.quoteSelector();
            if (!this.opening.traverseIndex(event.content)) {
                // throw Error('your move was not very good');
                this.showFailureNotification();
                setTimeout(() => {
                    this.game.undoLastMove();
                    this.triggerGameInterfaceCommand('displayMoveIndex--');
                }, 1000);
            } else {
                this.showSuccessNotification();
                // 1 second timeout
                setTimeout(() => {
                    const randMove = this.opening.selectAndTraverseRandomMove();
                    if (randMove !== null) {
                        this.game.makeMove(randMove);
                    }
                    this.triggerGameInterfaceCommand('redraw board');
                }, 1000);
            }
        }
    }
    private triggerGameInterfaceCommand(command: string): void {
        this.gameInterfaceCommand = command;
        // using setTimeout because it appears that a slight delay before reset
        // helps to trigger change detection smoothly (research required?)
        setTimeout(() => {
            this.gameInterfaceCommand = null;
        }, 10);
    }

    private showSuccessNotification(): void {
        this.alertType = 'alert-success';
        this.choiceHeadingMessage = 'Well done!';
    }

    private showFailureNotification(): void {
        this.alertType = 'alert-danger';
        this.choiceHeadingMessage = 'Wrong Move!';
    }

    private quoteSelector(): void {
        let quote = {
            str:
                '"You must take your opponent into a deep dark forest where ' +
                '2+2=5, and the path leading out is only wide ' +
                'enough for one."',
            by: 'Mikhail Tal'
        };
        this.choiceQuote = quote.str;
        this.choiceAuthor = quote.by;
    }

    public getGame(): Game {
        return this.game;
    }
    public getGameInterfaceCommand(): string {
        return this.gameInterfaceCommand;
    }
    public getAlertType(): string {
        return this.alertType;
    }
    public getChoiceHeadingMessage(): string {
        return this.choiceHeadingMessage;
    }
    public getChoiceQuote(): string {
        return this.choiceQuote;
    }
    public getChoiceAuthor(): string {
        return this.choiceAuthor;
    }
}
