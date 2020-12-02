import { Component, OnInit, ViewChild } from '@angular/core';
import {
    Board,
    Color,
    Game,
    Piece,
    PieceType,
    Rank
} from 'src/app/lib/game.library';
import { GameEvent, Move } from 'src/app/lib/interface.library';
import { GameComponent } from '../game/game.component';

@Component({
    selector: 'app-endgame-trainer',
    templateUrl: './endgame-trainer.component.html',
    styleUrls: ['./endgame-trainer.component.css']
})
export class EndgameTrainerComponent implements OnInit {
    @ViewChild('gameComponent') _gameComponent: GameComponent;
    private _game: Game;
    private _interfaceCommand: string;
    private _showBoardOverlay: boolean;
    private _boardOverlayData: {
        title: string;
        displayLoadingMessage: boolean;
        detailedMessage: string;
        displayButtons: string[];
    };
    private _colorToPlay: Color;

    // TODO not any
    private _endgameTrainingSets: any[];
    private _currentTrainingSet: any;

    constructor() {
        this._showBoardOverlay = false;
        this._boardOverlayData = {
            title: 'Well done!',
            displayLoadingMessage: false,
            detailedMessage: 'You completed this exercise successfully!',
            displayButtons: ['Retry Exercise']
        };
        this._endgameTrainingSets = [
            {
                name: 'Understanding the Square',
                info: [
                    'Count the number of squares the black pawn is away from the queening square.  Then count the same number of squares either left or right TOWARDS the white king.  Using these two sides, complete the square (you can always complete a square with this method).',
                    'If the white king can step into the square before the black pawn gets to move, the white king is in time to stop the pawn from queening.'
                ],
                boardSetup: (board: Board): void => {
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
                },
                moveValidator: (board: Board, move: Move): boolean => {
                    let pawnLocation = board.findPiece(
                        new Piece(PieceType.Pawn, Color.Black)
                    )[0];
                    let kingLocation = board.findPiece(
                        new Piece(PieceType.King, Color.White)
                    )[0];
                    if (
                        pawnLocation.rank === kingLocation.rank &&
                        Math.abs(pawnLocation.file - kingLocation.file) ===
                            pawnLocation.rank
                    ) {
                        return true;
                    }
                    return false;
                },
                completed: (board: Board): boolean => {
                    let blackPawns = board.findPiece(
                        new Piece(PieceType.Pawn, Color.Black)
                    );
                    if (blackPawns.length === 0) {
                        return true;
                    }
                    return false;
                }
            }
        ];
        this._currentTrainingSet = this._endgameTrainingSets[0];
    }

    ngOnInit() {
        this._game = new Game();
        // start with an empty board
        this.setupEndgameTrainingSet(this.currentTrainingSet);
    }

    private setupEndgameTrainingSet(set: any): void {
        let emptyBoardFEN = '8/8/8/8/8/8/8/8 w - - 0 1';
        this.game.setFEN(emptyBoardFEN);
        this.game.loadFEN();
        let board = this.game.getBoard();
        set.boardSetup(board);
        this.game.updateFENPiecesPositionsFromBoard();
        this._colorToPlay = this.game.getTurn();
    }

    public boardOverlayEvent(event: string): void {
        console.log('board overlay event', event);
        switch (event) {
            case 'Retry Exercise':
                this.setupEndgameTrainingSet(this.currentTrainingSet);
                // do we even need this?
                this.game.setMoveHistory([]);
                this._gameComponent.setInitPosition(this.game.getBoard());
                this._gameComponent.setDisplayedMoveIndex(0);
                setTimeout(() => {
                    this.triggerInterfaceCommand('redraw board');
                }, 500);
                break;
            default:
                break;
        }
        this._showBoardOverlay = false;
    }

    public gameDataEvent(event: GameEvent) {
        console.log(event);
        if (this.currentTrainingSet.completed(this.game.getBoard())) {
            // reset
            setTimeout(() => {
                this._showBoardOverlay = true;
            }, 1500);
        } else {
            if (
                // trigger black's move if white's is correct
                this.currentTrainingSet.moveValidator(
                    this.game.getBoard(),
                    event
                )
            ) {
                let pawnLocation = this.game
                    .getBoard()
                    .findPiece(new Piece(PieceType.Pawn, Color.Black))[0];
                let dest = {
                    file: pawnLocation.file,
                    rank: pawnLocation.rank - 1
                };
                let moveNotation = this.game.squareToString(dest);
                if (dest.rank === Rank.ONE) {
                    moveNotation += '=Q+';
                }
                setTimeout(() => {
                    this.game.makeMove(moveNotation);
                    this.triggerInterfaceCommand('move made, redraw board');
                }, 1000);
            } else {
                // move is wrong
                setTimeout(() => {
                    this.game.undoLastMove();
                    this.triggerInterfaceCommand('back');
                    console.log('game state', this.game);
                }, 1000);
            }
        }
    }

    private triggerInterfaceCommand(command: string) {
        this._interfaceCommand = command;
        // using setTimeout because it appears that a slight delay before reset
        // helps to trigger change detection smoothly (research required?)
        setTimeout(() => {
            this._interfaceCommand = null;
        }, 10);
    }

    get game(): Game {
        return this._game;
    }
    get interfaceCommand(): string {
        return this._interfaceCommand;
    }
    // TODO not any
    get currentTrainingSet(): any {
        return this._currentTrainingSet;
    }
    get showBoardOverlay(): boolean {
        return this._showBoardOverlay;
    }
    // TODO not any
    get boardOverlayData(): any {
        return this._boardOverlayData;
    }
    get colorToPlay(): Color {
        return this._colorToPlay;
    }
    // TODO colorToString utility function
    get colorToPlayToString(): string {
        return this.colorToPlay ? 'black' : 'white';
    }
}
