import { Component, OnInit, ViewChild } from '@angular/core';
import { Exercise } from 'src/app/lib/exercises/exercise.library';
import {
    Board,
    Color,
    Game,
    Piece,
    PieceType,
    File,
    Rank,
    Square
} from 'src/app/lib/game.library';
import { GameEvent, Move } from 'src/app/lib/interface.library';
import {
    randomFile,
    randomFileInclusivelyBetween,
    randomRank,
    randomRankInclusivelyBetween,
    squareToString
} from 'src/app/lib/util.library';
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
    private _endgameExercises: Exercise[];
    private _currentExercise: Exercise;

    constructor() {
        this._showBoardOverlay = false;
        this._boardOverlayData = {
            title: 'Well done!',
            displayLoadingMessage: false,
            detailedMessage: 'You completed this exercise successfully!',
            displayButtons: ['Retry Exercise']
        };
        this._endgameExercises = [];
        this._endgameExercises.push(
            new Exercise(
                'Understanding the Square',
                [
                    'Count the number of squares the black pawn is away from the queening square.  Then count the same number of squares either left or right TOWARDS the white king.  Using these two sides, complete the square (you can always complete a square with this method).',
                    'If the white king can step into the square before the black pawn gets to move, the white king is in time to stop the pawn from queening.'
                ],
                (board: Board): void => {
                    // setup
                    let r = randomRankInclusivelyBetween(Rank.THREE, Rank.FIVE);
                    let f = randomFileInclusivelyBetween(File.a, File.d);
                    if (f > 1) {
                        f += 4;
                    }
                    board.insertPiece(
                        {
                            file: f,
                            rank: r + 1
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
                (board: Board): string => {
                    // nextMove
                    let pawnLocation = board.findPiece(
                        new Piece(PieceType.Pawn, Color.Black)
                    )[0];
                    let dest = {
                        file: pawnLocation.file,
                        rank: pawnLocation.rank - 1
                    };
                    let moveNotation = squareToString(dest);
                    if (dest.rank === Rank.ONE) {
                        moveNotation += '=Q+';
                    }
                    return moveNotation;
                },
                (board: Board, move: Move): boolean => {
                    // moveValidator
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
                (board: Board): boolean => {
                    // complete
                    let blackPawns = board.findPiece(
                        new Piece(PieceType.Pawn, Color.Black)
                    );
                    let blackQueens = board.findPiece(
                        new Piece(PieceType.Queen, Color.Black)
                    );
                    if (blackPawns.length === 0 && blackQueens.length === 0) {
                        return true;
                    }
                    return false;
                }
            )
        );
        this._endgameExercises.push(
            new Exercise(
                'King and Rook vs King',
                ['needs explanation here', 'info'],
                (board: Board): void => {
                    // setup
                    let f = randomFile();
                    let r = randomRank();
                    let sf: File;
                    let sr: Rank;
                    if (Math.abs(f - 3.5) > Math.abs(r - 3.5)) {
                        // file is wider
                        let rookRank =
                            r > Rank.FOUR
                                ? randomRankInclusivelyBetween(
                                      Rank.ONE,
                                      Rank.TWO
                                  )
                                : randomRankInclusivelyBetween(
                                      Rank.SIX,
                                      Rank.EIGHT
                                  );
                        let kingRank =
                            r > Rank.FOUR
                                ? randomRankInclusivelyBetween(
                                      Rank.THREE,
                                      Rank.EIGHT
                                  )
                                : randomRankInclusivelyBetween(
                                      Rank.ONE,
                                      Rank.FIVE
                                  );
                        if (f > 3) {
                            // right target
                            let rookPosition: Square = {
                                file: randomFileInclusivelyBetween(
                                    File.a,
                                    f - 2
                                ),
                                rank: rookRank
                            };
                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            let whiteKingPosition: Square = {
                                file: randomFileInclusivelyBetween(
                                    File.a,
                                    f - 2
                                ),
                                rank: kingRank
                            };
                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        } else {
                            // left target
                            let rookPosition: Square = {
                                file: randomFileInclusivelyBetween(
                                    f + 2,
                                    File.h
                                ),
                                rank: rookRank
                            };
                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            let whiteKingPosition: Square = {
                                file: randomFileInclusivelyBetween(
                                    f + 2,
                                    File.h
                                ),
                                rank: kingRank
                            };
                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        }
                    } else {
                        // rank is wider
                        let rookFile =
                            f > File.d
                                ? randomFileInclusivelyBetween(File.a, File.c)
                                : randomFileInclusivelyBetween(File.f, File.h);
                        let kingFile =
                            f > File.d
                                ? randomFileInclusivelyBetween(File.d, File.h)
                                : randomFileInclusivelyBetween(File.a, File.e);
                        if (r > 3) {
                            // top target
                            let rookPosition: Square = {
                                file: rookFile,
                                rank: randomRankInclusivelyBetween(
                                    Rank.ONE,
                                    r - 2
                                )
                            };
                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            let whiteKingPosition: Square = {
                                file: kingFile,
                                rank: randomRankInclusivelyBetween(
                                    Rank.ONE,
                                    r - 2
                                )
                            };
                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        } else {
                            // bottom target
                            let rookPosition: Square = {
                                file: rookFile,
                                rank: randomRankInclusivelyBetween(
                                    r + 2,
                                    Rank.EIGHT
                                )
                            };
                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            let whiteKingPosition: Square = {
                                file: kingFile,
                                rank: randomRankInclusivelyBetween(
                                    r + 2,
                                    Rank.EIGHT
                                )
                            };
                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        }
                    }
                    board.insertPiece(
                        { file: sf, rank: sr },
                        new Piece(PieceType.King, Color.Black)
                    );
                },
                (board: Board): string => {
                    // nextMove
                    return 'boogalooga';
                },
                (board: Board, move: Move): boolean => {
                    // moveValidator
                    return false;
                },
                (board: Board): boolean => {
                    // complete
                    return false;
                }
            )
        );
        this._currentExercise = this._endgameExercises[1];
    }

    ngOnInit() {
        this._game = new Game();
        // start with an empty board
        this.setupEndgameTrainingSet(this.currentExercise);
    }

    private setupEndgameTrainingSet(exercise: Exercise): void {
        let emptyBoardFEN = '8/8/8/8/8/8/8/8 b - - 0 1';
        this.game.setFEN(emptyBoardFEN);
        this.game.loadFEN();
        let board = this.game.getBoard();
        exercise.setup(board);
        this.game.updateFENPiecesPositionsFromBoard();
        let firstMoveNotation = this.currentExercise.nextMove(
            this.game.getBoard()
        );
        setTimeout(() => {
            this.game.makeMove(firstMoveNotation);
            this.triggerInterfaceCommand('move made, redraw board');
            this._colorToPlay = this.game.getTurn();
        }, 1000);
    }

    public boardOverlayEvent(event: string): void {
        console.log('board overlay event', event);
        switch (event) {
            case 'Retry Exercise':
                this.game.setMoveHistory([]);
                this._gameComponent.setInitPosition(this.game.getBoard());
                this._gameComponent.setDisplayedMoveIndex(0);
                setTimeout(() => {
                    this.setupEndgameTrainingSet(this.currentExercise);
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
        if (this.currentExercise.complete(this.game.getBoard())) {
            // reset
            setTimeout(() => {
                this._showBoardOverlay = true;
            }, 1500);
        } else {
            if (
                // trigger black's move if white's is correct
                this.currentExercise.moveValidator(this.game.getBoard(), event)
            ) {
                let moveNotation = this.currentExercise.nextMove(
                    this.game.getBoard()
                );
                setTimeout(() => {
                    this.game.makeMove(moveNotation);
                    this.triggerInterfaceCommand('move made, redraw board');
                }, 1000);
            } else {
                // move is wrong
                setTimeout(() => {
                    let lastMove = this.game.undoLastMove();

                    this.triggerInterfaceCommand('back');
                    // this timeout is because of the trigger command's timeout
                    // can be removed when we do #117
                    setTimeout(() => {
                        this._gameComponent.drawBoard();
                        this._gameComponent.flashSquare(
                            lastMove.dest,
                            'red',
                            200,
                            3
                        );
                    }, 100);
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
    get currentExercise(): Exercise {
        return this._currentExercise;
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
