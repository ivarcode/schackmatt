import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Exercise } from 'src/app/lib/exercises/exercise.library';
import {
    Color,
    Game,
    Piece,
    PieceType,
    File,
    Rank
} from 'src/app/lib/game.library';
import {
    pickRandom,
    randomFile,
    randomFileInclusivelyBetween,
    randomRank,
    randomRankInclusivelyBetween
} from 'src/app/lib/util.library';
import {
    GameDisplayOptions,
    GameEvent,
    Move
} from 'src/app/lib/interface.library';
import { Square } from 'src/app/lib/square.library';
import { GameComponent } from '../game/game.component';
import { Sequence } from 'src/app/lib/sequence.library';

@Component({
    selector: 'app-endgame-trainer',
    templateUrl: './endgame-trainer.component.html',
    styleUrls: ['./endgame-trainer.component.css']
})
export class EndgameTrainerComponent implements OnInit, AfterViewInit {
    @ViewChild('gameComponent') _gameComponent: GameComponent;
    private _gameDisplayOptions: GameDisplayOptions;
    private _game: Game;
    private _showBoardOverlay: boolean;
    private _boardOverlayData: {
        title: string;
        displayLoadingMessage: boolean;
        detailedMessage: string;
        displayButtons: string[];
    };
    private _colorToPlay: Color;

    private _checkmateSequences: Sequence[];

    private _endgameExercises: Exercise[];
    private _currentExercise: Exercise;

    constructor() {
        this._showBoardOverlay = false;
        this._gameDisplayOptions = {
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
                    const board = game.getBoard();
                    const r = randomRankInclusivelyBetween(
                        Rank.THREE,
                        Rank.FIVE
                    );
                    let f = randomFileInclusivelyBetween(File.a, File.d);
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
                    const board = game.getBoard();
                    const pawnLocation = board.findPiece(
                        new Piece(PieceType.Pawn, Color.Black)
                    )[0];
                    const dest = new Square(
                        pawnLocation.file,
                        pawnLocation.rank - 1
                    );
                    let moveNotation = dest.toString();
                    if (dest.rank === Rank.ONE) {
                        moveNotation += '=Q+';
                    }
                    return moveNotation;
                },
                (game: Game, move: Move): boolean => {
                    // moveValidator
                    const board = game.getBoard();
                    const pawnLocation = board.findPiece(
                        new Piece(PieceType.Pawn, Color.Black)
                    )[0];
                    const kingLocation = board.findPiece(
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
                    const board = game.getBoard();
                    const blackPawns = board.findPiece(
                        new Piece(PieceType.Pawn, Color.Black)
                    );
                    const blackQueens = board.findPiece(
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
                    const board = game.getBoard();
                    const f = randomFile();
                    const r = randomRank();
                    if (Math.abs(f - 3.5) > Math.abs(r - 3.5)) {
                        // file is wider
                        const rookRank =
                            r > Rank.FOUR
                                ? randomRankInclusivelyBetween(
                                      Rank.ONE,
                                      Rank.TWO
                                  )
                                : randomRankInclusivelyBetween(
                                      Rank.SIX,
                                      Rank.EIGHT
                                  );
                        const kingRank =
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
                            const rookPosition = new Square(
                                randomFileInclusivelyBetween(File.a, f - 2),
                                rookRank
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            const whiteKingPosition = new Square(
                                randomFileInclusivelyBetween(File.a, f - 2),
                                kingRank
                            );

                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        } else {
                            // left target
                            const rookPosition = new Square(
                                randomFileInclusivelyBetween(f + 2, File.h),
                                rookRank
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            const whiteKingPosition = new Square(
                                randomFileInclusivelyBetween(f + 2, File.h),
                                kingRank
                            );

                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        }
                    } else {
                        // rank is wider
                        const rookFile =
                            f > File.d
                                ? randomFileInclusivelyBetween(File.a, File.c)
                                : randomFileInclusivelyBetween(File.f, File.h);
                        const kingFile =
                            f > File.d
                                ? randomFileInclusivelyBetween(File.d, File.h)
                                : randomFileInclusivelyBetween(File.a, File.e);
                        if (r > 3) {
                            // top target
                            const rookPosition = new Square(
                                rookFile,
                                randomRankInclusivelyBetween(Rank.ONE, r - 2)
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            const whiteKingPosition = new Square(
                                kingFile,
                                randomRankInclusivelyBetween(Rank.ONE, r - 2)
                            );

                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        } else {
                            // bottom target
                            const rookPosition = new Square(
                                rookFile,
                                randomRankInclusivelyBetween(r + 2, Rank.EIGHT)
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            const whiteKingPosition = new Square(
                                kingFile,
                                randomRankInclusivelyBetween(r + 2, Rank.EIGHT)
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
                    const board = game.getBoard();
                    // console.log('movehist', game.getMoveHistory());
                    if (game.getMoveHistory().length === 0) {
                        // FIRST MOVE
                        console.log(game.getLegalMoves());
                        const moves = game.getLegalMoves();
                        const validMoves: Move[] = [];
                        // construct valid moves
                        for (const m of moves) {
                            if (
                                Math.abs(m.src.file - 3.5) >
                                Math.abs(m.src.rank - 3.5)
                            ) {
                                // file sided
                                if (m.src.file >= File.e) {
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
                                if (m.src.rank >= Rank.FIVE) {
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
                        const move: Move = pickRandom(validMoves);
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
                                const whiteKingPosition = board.findPiece(
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
                    const preBoard = new Game(
                        game.getMoveHistory()[
                            game.getMoveHistory().length - 1
                        ].preMoveFEN
                    ).getBoard();
                    const board = game.getBoard();
                    // console.log('move', board, move);
                    const blackKing: Square = game.findKing(Color.Black);
                    const whiteKing: Square = game.findKing(Color.White);
                    const whiteRook: Square = board.findPiece(
                        new Piece(PieceType.Rook, Color.White)
                    )[0];
                    // if (
                    //     Math.abs(blackKing.file - 3.5) >
                    //     Math.abs(blackKing.rank - 3.5)
                    // ) {
                    //     // file sided
                    //     if (blackKing.file >= File.e) {
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
                    const blacksNext = game.getLegalMoves();
                    for (const m of blacksNext) {
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

        this._checkmateSequences = [];
        this._checkmateSequences.push(
            new Sequence(
                '8/8/1Q6/3k4/1R6/8/3K4/8 w - - 0 1',
                '1. Rd4+ Ke5 2. Qd6+ Kf5 3. Rf4+ Kg5 4. Qf6+ Kh5 5. Rh4#'
            )
        );
    }

    ngOnInit() {
        // this could also go in constructor I suppose
        this._game = new Game();
    }

    ngAfterViewInit() {
        console.log('after');
        // setup first training set
        this.setupEndgameTrainingSet(this.currentExercise);
    }

    private setupEndgameTrainingSet(exercise: Exercise): void {
        const emptyBoardFEN = '8/8/8/8/8/8/8/8 b - - 0 1';
        this.game.setFEN(emptyBoardFEN);
        this.game.loadFEN();
        exercise.setup(this.game);
        this.game.updateFENPiecesPositionsFromBoard();
        this.gameComponent.initPosition = this.game.getBoard();
        const firstMoveNotation = this.currentExercise.nextMove(this.game);
        this.gameComponent.drawBoard();
        setTimeout(() => {
            this.game.makeMove(firstMoveNotation);
            this.gameComponent.displayedMoveIndex++;
            this.gameComponent.drawBoard();
            this._colorToPlay = this.game.getTurn();
        }, 1000);
    }

    public boardOverlayEvent(event: string): void {
        console.log('board overlay event', event);
        switch (event) {
            case 'Retry Exercise':
                this.game.setMoveHistory([]);
                // this.gameComponent.initPosition = this.game.getBoard();
                this.gameComponent.displayedMoveIndex = 0;

                // this.gameComponent.drawBoard();
                this.setupEndgameTrainingSet(this.currentExercise);
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
                    this.gameComponent.displayedMoveIndex++;
                    this.gameComponent.drawBoard();
                }, 1000);
            } else {
                // move is wrong
                setTimeout(() => {
                    const lastMove = this.game.undoLastMove();
                    if (this.gameComponent.displayedMoveIndex !== 0) {
                        this.gameComponent.displayedMoveIndex--;
                        this.gameComponent.drawBoard();
                    }

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

    get game(): Game {
        return this._game;
    }
    get gameComponent(): GameComponent {
        return this._gameComponent;
    }
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
    get checkmateSequences(): Sequence[] {
        return this._checkmateSequences;
    }
}
