import { Component, OnInit, ViewChild } from '@angular/core';
import { Game } from 'src/app/lib/game.library';
import { Study, moveClassificationKey } from 'src/app/lib/study.library';
import { GameEvent, Branch, GameConfig } from 'src/app/lib/interface.library';
import { Openings } from 'src/app/data/openings';
import { GameComponent } from '../game/game.component';
import { Color } from 'src/app/lib/util.library';

@Component({
    selector: 'app-opening-training-game',
    templateUrl: './opening-training-game.component.html',
    styleUrls: ['./opening-training-game.component.css']
})
export class OpeningTrainingGameComponent implements OnInit {
    @ViewChild('gameComponent') _gameComponent: GameComponent;

    private game: Game;
    private _gameConfig: GameConfig;
    private opening: Study;
    private alertType: string;
    private choiceHeadingMessage: string;
    private choiceSubMessage: string;
    private choiceQuote: string;
    private choiceAuthor: string;
    private notificationVisibility: boolean;
    private showBoardOverlay: boolean;
    private boardOverlayData: {
        title: string;
        displayLoadingMessage: boolean;
        detailedMessage: string;
        displayButtons: string[];
    };

    constructor() {
        this.game = new Game();
        this._gameConfig = {
            maxSquareDimensions: 80,
            restrictPieces: [],
            orientation: Color.White,
            showCoordinates: true,
            colorScheme: {
                light: '#f0d9b9',
                dark: '#b58868'
            }
        };
        this.opening = null;
        this.alertType = 'alert-warning';
        this.choiceHeadingMessage = 'no message';
        this.choiceSubMessage = 'none';
        this.choiceAuthor = '';
        this.choiceQuote = '';
        this.notificationVisibility = false;
        this.showBoardOverlay = true;
        this.boardOverlayData = {
            title: null,
            displayLoadingMessage: true,
            detailedMessage: 'Please wait.',
            displayButtons: []
        };
    }
    ngOnInit() {
        // this timeout solution is probably not correct...
        setTimeout(() => {
            // TODO pass in opening as OBJECT
            this.opening = new Study(Openings.openings[0].pgnData);
            // this.opening = new Study(Openings.openings[2].pgnData);
            this.showBoardOverlay = false;
            this.traverseToDefiningMove();
        }, 200);
    }
    public navigationDataEvent(event: string): void {
        console.log('nav emit', event);
        if (
            event === 'forward' &&
            this.gameComponent.displayedMoveIndex <
                this.game.moveHistory.length - 1
        ) {
            this.gameComponent.displayedMoveIndex++;
            this.gameComponent.drawBoard();
        } else if (
            event === 'back' &&
            this.gameComponent.displayedMoveIndex > 0
        ) {
            this.gameComponent.displayedMoveIndex--;
            this.gameComponent.drawBoard();
        }
    }
    public resetBoard(): void {
        this.game = new Game();
        this.traverseToDefiningMove();
    }
    public boardOverlayEvent(event: string): void {
        console.log('board overlay event', event);
        switch (event) {
            case 'retry opening':
                console.log('resetting opening');
                this.game = new Game();
                this.traverseToDefiningMove();
                break;
            default:
                break;
        }
        this.showBoardOverlay = false;
        // this.opening.getCurrentChapter().index=()
    }

    public gameDataEvent(event: GameEvent): void {
        console.log('game emit', event);
        if (event.type === 'move') {
            this.quoteSelector();
            console.log('played', this.opening.getCurrentChapter().index);
            if (
                !this.opening.traverseIndex(event.content) ||
                this.opening.getCurrentChapter().index.classification === '?' ||
                this.opening.getCurrentChapter().index.classification === '??'
            ) {
                // if the move is not in the study branch OR
                // if the move is classified as not ideal
                this.showNotification(
                    'alert-danger',
                    this.opening.getCurrentChapter().index
                );
                setTimeout(() => {
                    this.game.undoLastMove();

                    this.gameComponent.displayedMoveIndex--;
                    this.gameComponent.drawBoard();
                }, 1000);
            } else {
                this.showNotification(
                    'alert-success',
                    this.opening.getCurrentChapter().index
                );
                if (this.isLineIsOver()) {
                    return;
                }
                // 1 second timeout
                setTimeout(() => {
                    const randMove = this.opening.selectNextTickMove();
                    if (randMove !== null) {
                        this.game.makeMove(randMove);
                    }
                    this.gameComponent.displayedMoveIndex++;
                    this.gameComponent.drawBoard();
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
    public traverseToDefiningMove(): void {
        this.game.makeMove(
            this.opening.getCurrentChapter().root.options[0].definingMove
        );
        let numberOfTraversals = 1;
        this.opening.getCurrentChapter().index = this.opening.getCurrentChapter().root.options[0];
        console.log(
            'this.opening.getCurrentChapter().index',
            this.opening.getCurrentChapter().index
        );
        while (
            !this.opening.getCurrentChapter().index.explanation ||
            this.opening.getCurrentChapter().index.explanation.substr(0, 16) !==
                'DEFINING MOVE ::'
        ) {
            if (this.opening.getCurrentChapter().index.options.length === 0) {
                throw new Error('no defining move in this tree');
            }
            const expl = this.opening.getCurrentChapter().index.options[0]
                .explanation;
            console.log(expl);
            if (expl && expl.substr(0, 16) === 'DEFINING MOVE ::') {
                break;
            }
            this.game.makeMove(
                this.opening.getCurrentChapter().index.options[0].definingMove
            );
            numberOfTraversals++;
            this.opening.getCurrentChapter().index =
                this.opening.getCurrentChapter().index.options.length !== 0
                    ? this.opening.getCurrentChapter().index.options[0]
                    : null;
        }
        this.gameComponent.displayedMoveIndex += numberOfTraversals;
        console.log(
            'this.opening.getCurrentChapter().index',
            this.opening.getCurrentChapter().index
        );
    }

    // sets boardOverlayData and returns true if line is over
    private isLineIsOver(): boolean {
        if (this.opening.getCurrentChapter().index.options.length === 0) {
            // the line is over!
            console.log('completed the line');
            this.boardOverlayData = {
                title: 'You have completed the line!',
                displayLoadingMessage: false,
                detailedMessage: null,
                displayButtons: ['retry opening']
            };
            this.showBoardOverlay = true;
            return true;
        }
        return false;
    }

    private showNotification(result: string, index?: Branch): void {
        console.log(result, index);
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
        if (index.explanation) {
            const explObj = this.getExplanationObject(index);
            console.log(explObj);
            this.choiceSubMessage = explObj.head;
            this.choiceQuote = explObj.body;
            // this.choiceAuthor = null;
        } else {
            this.choiceQuote = null;
            // this.choiceAuthor = null;
        }
    }

    private getExplanationObject(
        branch: Branch
    ): {
        head: string;
        body: string;
    } {
        const ret = {
            head: null,
            body: null
        };
        if (branch.explanation && branch.classification) {
            ret.head = moveClassificationKey[branch.classification];
            // ret.body = branch.explanation.substr(
            //     moveClassificationKey[branch.classification].length + 1
            // );
        } else {
            ret.body = branch.explanation;
        }
        return ret;
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
        const quote = {
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
    public getAlertType(): string {
        return this.alertType;
    }
    public getChoiceHeadingMessage(): string {
        return this.choiceHeadingMessage;
    }
    public getChoiceSubMessage(): string {
        return this.choiceSubMessage;
    }
    public getChoiceQuote(): string {
        return this.choiceQuote;
    }
    public getChoiceAuthor(): string {
        return this.choiceAuthor;
    }
    get gameConfig(): GameConfig {
        return this._gameConfig;
    }
    get gameComponent(): GameComponent {
        return this._gameComponent;
    }
}
