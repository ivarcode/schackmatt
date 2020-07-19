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
    private notificationVisibility: boolean;
    private showBoardOverlay: boolean;
    private boardOverlayData: {
        title: string;
        displayLoadingMessage: boolean;
        detailedMessage: string;
        displayButtons: boolean;
    };

    constructor() {
        this.game = new Game();
        this.opening = null;
        this.alertType = 'alert-warning';
        this.choiceHeadingMessage = 'no message';
        this.choiceAuthor = '';
        this.choiceQuote = '';
        this.notificationVisibility = false;
        this.showBoardOverlay = true;
        this.boardOverlayData = {
            title: null,
            displayLoadingMessage: true,
            detailedMessage: 'Please wait.',
            displayButtons: false
        };
    }
    ngOnInit() {
        // this timeout solution is probably not correct...
        setTimeout(() => {
            // TODO pass in opening as OBJECT
            // this.opening = new Study(Openings.openings[0].pgnData);
            this.opening = new Study(Openings.openings[1].pgnData);
            this.showBoardOverlay = false;
            this.traverseToDefiningMove();
        }, 200);
    }
    public navigationDataEvent(event: string): void {
        console.log('nav emit', event);
        if (event === 'forward' || event === 'back') {
            this.triggerGameInterfaceCommand(event);
        }
    }
    public boardOverlayEvent(event: string): void {
        console.log('board overlay event', event);
        switch (event) {
            case 'retry opening':
                console.log('resetting opening');
                this.traverseToDefiningMove();
                break;
            default:
                break;
        }
        this.showBoardOverlay = false;
        // this.opening.setIndex()
    }

    public gameDataEvent(event: GameEvent): void {
        console.log('game emit', event);
        if (event.type === 'move') {
            this.quoteSelector();
            console.log('played', this.opening.getIndex());
            if (
                !this.opening.traverseIndex(event.content) ||
                this.opening.getIndex().classification === '?' ||
                this.opening.getIndex().classification === '??'
            ) {
                // if the move is not in the study branch OR
                // if the move is classified as not ideal
                this.showNotification(
                    'alert-danger',
                    this.opening.getIndex().explanation
                );
                setTimeout(() => {
                    this.game.undoLastMove();
                    this.triggerGameInterfaceCommand('displayMoveIndex--');
                }, 1000);
            } else {
                this.showNotification(
                    'alert-success',
                    this.opening.getIndex().explanation
                );
                if (this.isLineIsOver()) {
                    return;
                }
                // 1 second timeout
                setTimeout(() => {
                    const randMove = this.opening.selectAndTraverseRandomMove();
                    if (randMove !== null) {
                        this.game.makeMove(randMove);
                    }
                    this.triggerGameInterfaceCommand('move made, redraw board');
                    setTimeout(() => {
                        if (this.isLineIsOver()) {
                            return;
                        }
                    }, 1000);
                }, 1000);
            }
        }
    }

    /**
     * @description navigates to the move PRIOR to the opening defined move
     * TODO needs to be rewritten, it is redundant, bad logic. (but does work)
     */
    private traverseToDefiningMove(): void {
        this.game.makeMove(this.opening.getRoot().options[0].definingMove);
        let numberOfTraversals = 1;
        this.opening.setIndex(this.opening.getRoot().options[0]);
        console.log('this.opening.getIndex()', this.opening.getIndex());
        while (
            !this.opening.getIndex().explanation ||
            this.opening.getIndex().explanation.substr(0, 16) !==
                'DEFINING MOVE ::'
        ) {
            if (this.opening.getIndex().options.length === 0) {
                throw new Error('no defining move in this tree');
            }
            const expl = this.opening.getIndex().options[0].explanation;
            console.log(expl);
            if (expl && expl.substr(0, 16) === 'DEFINING MOVE ::') {
                break;
            }
            this.game.makeMove(this.opening.getIndex().options[0].definingMove);
            numberOfTraversals++;
            this.opening.setIndex(
                this.opening.getIndex().options.length !== 0
                    ? this.opening.getIndex().options[0]
                    : null
            );
        }
        this.triggerGameInterfaceCommand('traverse ' + numberOfTraversals);
        console.log('this.opening.getIndex()', this.opening.getIndex());
    }
    // sets boardOverlayData and returns true if line is over
    private isLineIsOver(): boolean {
        if (this.opening.getIndex().options.length === 0) {
            // the line is over!
            console.log('completed the line');
            this.boardOverlayData = {
                title: 'You have completed the line!',
                displayLoadingMessage: false,
                detailedMessage: null,
                displayButtons: true
            };
            this.showBoardOverlay = true;
            return true;
        }
        return false;
    }

    private triggerGameInterfaceCommand(command: string): void {
        this.gameInterfaceCommand = command;
        // using setTimeout because it appears that a slight delay before reset
        // helps to trigger change detection smoothly (research required?)
        setTimeout(() => {
            this.gameInterfaceCommand = null;
        }, 10);
    }

    private showNotification(result: string, explanation?: string): void {
        this.alertType = result;
        this.notificationVisibility = true;
        switch (this.alertType) {
            case 'alert-success':
                this.choiceHeadingMessage = 'Well done!';
                break;
            case 'alert-danger':
                this.choiceHeadingMessage = 'Wrong move!';
                break;
            default:
                this.choiceHeadingMessage = 'unknown value';
                this.notificationVisibility = false;
        }
        if (explanation) {
            this.choiceQuote = explanation;
            this.choiceAuthor = null;
        } else {
            this.choiceQuote = null;
            this.choiceAuthor = null;
        }
    }

    public getNotificationVisibility(): boolean {
        return this.notificationVisibility;
    }
    public getShowBoardOverlay(): boolean {
        return this.showBoardOverlay;
    }
    public getBoardOverlayData(): {
        title: string;
        displayLoadingMessage: boolean;
    } {
        return this.boardOverlayData;
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
    public getOpening(): Study {
        return this.opening;
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
