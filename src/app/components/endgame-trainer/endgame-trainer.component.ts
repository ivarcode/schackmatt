import { Component, OnInit, ViewChild } from '@angular/core';
import { Exercise } from 'src/app/lib/exercises/exercise.library';
import { Game } from 'src/app/lib/game.library';
import {
    Color,
    PieceType,
    FILE,
    RANK,
    pickRandom,
    randomFile,
    randomFileInclusivelyBetween,
    randomRank,
    randomRankInclusivelyBetween,
    parseLichessStudy
} from 'src/app/lib/util.library';
import {
    GameDisplayOptions,
    GameEvent,
    Move
} from 'src/app/lib/interface.library';
import { Square } from 'src/app/lib/square.library';
import { GameComponent } from '../game/game.component';
import { Piece } from 'src/app/lib/piece.libary';

@Component({
    selector: 'app-endgame-trainer',
    templateUrl: './endgame-trainer.component.html',
    styleUrls: ['./endgame-trainer.component.css']
})
export class EndgameTrainerComponent implements OnInit {
    @ViewChild('gameComponent') _gameComponent: GameComponent;
    private _gameDisplayOptions: GameDisplayOptions;
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
        // TEMP
        // let parsedStudy = parseLichessStudy(lichessData['0']);
        // console.log('parsed file', parsedStudy);

        this._showBoardOverlay = false;
        this._gameDisplayOptions = {
            orientation: Color.Black,
            showCoordinates: true,
            colorScheme: {
                light: '#f0d9b9',
                dark: '#b58868'
            }
        };
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
                (game: Game): void => {
                    // setup
                    let board = game.board;
                    let r = randomRankInclusivelyBetween(RANK.THREE, RANK.FIVE);
                    let f = randomFileInclusivelyBetween(FILE.a, FILE.d);
                    if (f > 1) {
                        f += 4;
                    }
                    board.insertPiece(
                        new Square(f, r + 1),
                        new Piece(PieceType.Pawn, Color.Black)
                    );
                    board.insertPiece(
                        // calculated position of King
                        new Square(f > 1 ? f - (r + 1) : f + (r + 1), r + 1),
                        new Piece(PieceType.King, Color.White)
                    );
                    board.insertPiece(
                        new Square(Math.floor(Math.random() * 8), r + 3),
                        new Piece(PieceType.King, Color.Black)
                    );
                },
                (game: Game): string => {
                    // nextMove
                    let board = game.board;
                    let pawnLocation = board.findPiece(
                        new Piece(PieceType.Pawn, Color.Black)
                    )[0];
                    let dest = new Square(
                        pawnLocation.file,
                        pawnLocation.rank - 1
                    );
                    let moveNotation = dest.toString();
                    if (dest.rank === RANK.ONE) {
                        moveNotation += '=Q+';
                    }
                    return moveNotation;
                },
                (game: Game, move: Move): boolean => {
                    // moveValidator
                    let board = game.board;
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
                (game: Game): boolean => {
                    // complete
                    let board = game.board;
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
                (game: Game): void => {
                    // setup
                    let board = game.board;
                    let f = randomFile();
                    let r = randomRank();
                    if (Math.abs(f - 3.5) > Math.abs(r - 3.5)) {
                        // file is wider
                        let rookRank =
                            r > RANK.FOUR
                                ? randomRankInclusivelyBetween(
                                      RANK.ONE,
                                      RANK.TWO
                                  )
                                : randomRankInclusivelyBetween(
                                      RANK.SIX,
                                      RANK.EIGHT
                                  );
                        let kingRank =
                            r > RANK.FOUR
                                ? randomRankInclusivelyBetween(
                                      RANK.THREE,
                                      RANK.EIGHT
                                  )
                                : randomRankInclusivelyBetween(
                                      RANK.ONE,
                                      RANK.FIVE
                                  );
                        if (f > 3) {
                            // right target
                            let rookPosition = new Square(
                                randomFileInclusivelyBetween(FILE.a, f - 2),
                                rookRank
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            let whiteKingPosition = new Square(
                                randomFileInclusivelyBetween(FILE.a, f - 2),
                                kingRank
                            );

                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        } else {
                            // left target
                            let rookPosition = new Square(
                                randomFileInclusivelyBetween(f + 2, FILE.h),
                                rookRank
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            let whiteKingPosition = new Square(
                                randomFileInclusivelyBetween(f + 2, FILE.h),
                                kingRank
                            );

                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        }
                    } else {
                        // rank is wider
                        let rookFile =
                            f > FILE.d
                                ? randomFileInclusivelyBetween(FILE.a, FILE.c)
                                : randomFileInclusivelyBetween(FILE.f, FILE.h);
                        let kingFile =
                            f > FILE.d
                                ? randomFileInclusivelyBetween(FILE.d, FILE.h)
                                : randomFileInclusivelyBetween(FILE.a, FILE.e);
                        if (r > 3) {
                            // top target
                            let rookPosition = new Square(
                                rookFile,
                                randomRankInclusivelyBetween(RANK.ONE, r - 2)
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            let whiteKingPosition = new Square(
                                kingFile,
                                randomRankInclusivelyBetween(RANK.ONE, r - 2)
                            );

                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        } else {
                            // bottom target
                            let rookPosition = new Square(
                                rookFile,
                                randomRankInclusivelyBetween(r + 2, RANK.EIGHT)
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            let whiteKingPosition = new Square(
                                kingFile,
                                randomRankInclusivelyBetween(r + 2, RANK.EIGHT)
                            );

                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        }
                    }
                    board.insertPiece(
                        new Square(f, r),
                        new Piece(PieceType.King, Color.Black)
                    );
                },
                (game: Game): string => {
                    // nextMove
                    const board = game.board;
                    // console.log('movehist', game.moveHistory);
                    if (game.moveHistory.length === 0) {
                        // FIRST MOVE
                        console.log(game.getLegalMoves());
                        let moves = game.getLegalMoves();
                        let validMoves: Move[] = [];
                        // construct valid moves
                        for (let m of moves) {
                            if (
                                Math.abs(m.src.file - 3.5) >
                                Math.abs(m.src.rank - 3.5)
                            ) {
                                // file sided
                                if (m.src.file >= FILE.e) {
                                    // right
                                    if (m.dest.file >= m.src.file) {
                                        validMoves.push(m);
                                    }
                                } else {
                                    // left
                                    if (m.dest.file <= m.src.file) {
                                        validMoves.push(m);
                                    }
                                }
                            } else {
                                // rank sided
                                if (m.src.rank >= RANK.FIVE) {
                                    // top
                                    if (m.dest.rank >= m.src.rank) {
                                        validMoves.push(m);
                                    }
                                } else {
                                    // bot
                                    if (m.dest.rank <= m.src.rank) {
                                        validMoves.push(m);
                                    }
                                }
                            }
                        }
                        console.log('validMoves', validMoves);
                        let move: Move = pickRandom(validMoves);
                        return 'K' + move.dest.toString();
                    }
                    // ANY OTHER MOVE
                    const allMoves = game.getLegalMoves();
                    let preferredMove: Move;
                    for (const m of allMoves) {
                        if (!preferredMove) {
                            preferredMove = m;
                        } else {
                            // try to go towards the center of the board
                            if (
                                m.dest.isCloserToCenterThan(preferredMove.dest)
                            ) {
                                // avoid being directly across from white king
                                let whiteKingPosition = board.findPiece(
                                    new Piece(PieceType.King, Color.White)
                                );
                                if (true) {
                                }
                                preferredMove = m;
                            }
                        }
                    }
                    return 'K' + preferredMove.dest.toString();
                },
                (game: Game, move: GameEvent): boolean => {
                    // TODO complete this with a systematic pattern
                    // moveValidator
                    let preBoard = new Game(
                        game.moveHistory[game.moveHistory.length - 1].preMoveFEN
                    ).board;
                    let board = game.board;
                    // console.log('move', board, move);
                    let blackKing: Square = game.findKing(Color.Black);
                    let whiteKing: Square = game.findKing(Color.White);
                    let whiteRook: Square = board.findPiece(
                        new Piece(PieceType.Rook, Color.White)
                    )[0];
                    // if (
                    //     Math.abs(blackKing.file - 3.5) >
                    //     Math.abs(blackKing.rank - 3.5)
                    // ) {
                    //     // file sided
                    //     if (blackKing.file >= FILE.e) {
                    //         // right
                    //         if (
                    //             whiteRook.file === blackKing.file - 1 &&
                    //             Math.abs(whiteRook.rank - blackKing.rank) > 1
                    //         ) {

                    //         }
                    //     }
                    // } else {
                    //     // rank sided
                    // }
                    let blacksNext = game.getLegalMoves();
                    for (let m of blacksNext) {
                        if (m.dest.toString() === whiteRook.toString()) {
                            return false;
                        }
                    }
                    return true;
                },
                (game: Game): boolean => {
                    // complete
                    return game.isCheckmate();
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
        const emptyBoardFEN = '8/8/8/8/8/8/8/8 b - - 0 1';
        this.game.fen = emptyBoardFEN;
        this.game.loadFEN();
        exercise.setup(this.game);
        this.game.updateFENPiecesPositionsFromBoard();
        const firstMoveNotation = this.currentExercise.nextMove(this.game);
        setTimeout(() => {
            this.game.makeMove(firstMoveNotation);
            this.triggerInterfaceCommand('move made, redraw board');
            this._colorToPlay = this.game.turn;
        }, 1000);
    }

    public boardOverlayEvent(event: string): void {
        console.log('board overlay event', event);
        switch (event) {
            case 'Retry Exercise':
                this.triggerInterfaceCommand('redraw board');
                this.game.moveHistory = [];
                this._gameComponent.setInitPosition(this.game.board);
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
        if (this.currentExercise.complete(this.game)) {
            // reset
            setTimeout(() => {
                this._showBoardOverlay = true;
            }, 1500);
        } else {
            if (
                // trigger black's move if white's is correct
                this.currentExercise.moveValidator(this.game, event)
            ) {
                const moveNotation = this.currentExercise.nextMove(this.game);
                setTimeout(() => {
                    this.game.makeMove(moveNotation);
                    this.triggerInterfaceCommand('move made, redraw board');
                }, 1000);
            } else {
                // move is wrong
                setTimeout(() => {
                    const lastMove = this.game.undoLastMove();

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
    get gameDisplayOptions(): GameDisplayOptions {
        return this._gameDisplayOptions;
    }
}
