import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
    colorToString,
    parseLichessStudies,
    oppositeColor,
    randomNumberInclusivelyBetween
} from 'src/app/lib/util.library';
import {
    GameDisplayOptions,
    GameEvent,
    LineNode,
    Move,
    Puzzle
} from 'src/app/lib/interface.library';
import { Square } from 'src/app/lib/square.library';
import { GameComponent } from '../game/game.component';
import { Piece } from 'src/app/lib/piece.libary';
import { basic_checkmates } from 'data/basic_checkmates.json';

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

    // private _checkmateSequences: Sequence[];
    // private _currentSequence: Sequence;

    private _endgameExercises: Exercise[];
    private _currentExercise: Exercise;

    private _currentPuzzleIndex: number;
    private _endgamePuzzles: Puzzle[];
    private _currentPuzzleNode: LineNode;

    constructor() {
        // TEMP
        this.endgamePuzzles = parseLichessStudies(basic_checkmates);
        this.currentPuzzleIndex = 1;

        this.currentPuzzleNode = this.currentPuzzle.pgn;

        // console.log('endgmae puzzles', this.endgamePuzzles);
        // console.log(this.currentPuzzle);

        // console.log('testing char specials', parsedStudy.pgn.comment);

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
                    const board = game.board;
                    const r = randomRankInclusivelyBetween(
                        RANK.THREE,
                        RANK.FIVE
                    );
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
                    const board = game.board;
                    const pawnLocation = board.findPiece(
                        new Piece(PieceType.Pawn, Color.Black)
                    )[0];
                    const dest = new Square(
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
                    const board = game.board;
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
                    const board = game.board;
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
                // TODO
                // this fails if we stalemate the king, ERROR!
                'King and Rook vs King',
                ['needs explanation here', 'info'],
                (game: Game): void => {
                    // setup
                    const board = game.board;
                    const f = randomFile();
                    const r = randomRank();
                    if (Math.abs(f - 3.5) > Math.abs(r - 3.5)) {
                        // file is wider
                        const rookRank =
                            r > RANK.FOUR
                                ? randomRankInclusivelyBetween(
                                      RANK.ONE,
                                      RANK.TWO
                                  )
                                : randomRankInclusivelyBetween(
                                      RANK.SIX,
                                      RANK.EIGHT
                                  );
                        const kingRank =
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
                            const rookPosition = new Square(
                                randomFileInclusivelyBetween(FILE.a, f - 2),
                                rookRank
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            const whiteKingPosition = new Square(
                                randomFileInclusivelyBetween(FILE.a, f - 2),
                                kingRank
                            );

                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        } else {
                            // left target
                            const rookPosition = new Square(
                                randomFileInclusivelyBetween(f + 2, FILE.h),
                                rookRank
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            const whiteKingPosition = new Square(
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
                        const rookFile =
                            f > FILE.d
                                ? randomFileInclusivelyBetween(FILE.a, FILE.c)
                                : randomFileInclusivelyBetween(FILE.f, FILE.h);
                        const kingFile =
                            f > FILE.d
                                ? randomFileInclusivelyBetween(FILE.d, FILE.h)
                                : randomFileInclusivelyBetween(FILE.a, FILE.e);
                        if (r > 3) {
                            // top target
                            const rookPosition = new Square(
                                rookFile,
                                randomRankInclusivelyBetween(RANK.ONE, r - 2)
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            const whiteKingPosition = new Square(
                                kingFile,
                                randomRankInclusivelyBetween(RANK.ONE, r - 2)
                            );

                            board.insertPiece(
                                whiteKingPosition,
                                new Piece(PieceType.King, Color.White)
                            );
                        } else {
                            // bottom target
                            const rookPosition = new Square(
                                rookFile,
                                randomRankInclusivelyBetween(r + 2, RANK.EIGHT)
                            );

                            board.insertPiece(
                                rookPosition,
                                new Piece(PieceType.Rook, Color.White)
                            );
                            const whiteKingPosition = new Square(
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
                        const moves = game.getLegalMoves();
                        const validMoves: Move[] = [];
                        // construct valid moves
                        for (const m of moves) {
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
                        game.moveHistory[game.moveHistory.length - 1].preMoveFEN
                    ).board;
                    const board = game.board;
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

        // this._checkmateSequences = [];
        // this.checkmateSequences.push(
        //     new Sequence(
        //         'Queen & Rook Killbox',
        //         '8/8/1Q6/4k3/1R6/8/3K4/8 b - - 0 1',
        //         '1. ... Kd5 2. Rd4+ Ke5 3. Qd6+ Kf5 4. Rf4+ Kg5 5. Qf6+ Kh5 6. Rh4#'
        //     )
        // );
        // this.checkmateSequences.push(
        //     new Sequence(
        //         'Queen & King vs King',
        //         '4k3/1Q6/3K4/8/8/8/8/8 b - - 0 1',
        //         '1. ... Kd8 2. Qd7#'
        //     )
        // );
        // this.currentSequence = this.checkmateSequences[0];
    }

    ngOnInit() {
        // this could also go in constructor I suppose
        this.game = new Game();
    }

    ngAfterViewInit() {
        // console.log('after');
        // setup first training set
        // this.setupEndgameTrainingSet(this.currentExercise);
        this.setupPuzzle(this.currentPuzzleIndex);
    }

    public setupPuzzle(puzzleIndex: number): void {
        this.currentPuzzleIndex = puzzleIndex;
        console.log(this.currentPuzzle);

        this.currentPuzzleNode = this.currentPuzzle.pgn;
        this.game.fen = this.currentPuzzle.FEN;
        this.gameComponent.displayedMoveIndex = 0;
        this.game.loadFEN();
        this.game.updateFENPiecesPositionsFromBoard();
        this.gameComponent.initPosition = this.game.board;
        this.gameDisplayOptions.orientation = oppositeColor(this.game.turn);
        this.gameComponent.drawBoard();
        this.game.moveHistory = [];
        setTimeout(() => {
            this.currentPuzzleNode = this.currentPuzzleNode.nextNodes[0];
            // this.currentPuzzleNode = this.currentPuzzleNode.nextNodes[
            //     randomNumberInclusivelyBetween(
            //         0,
            //         this.currentPuzzleNode.nextNodes.length - 1
            //     )
            // ];
            const m = this.currentPuzzleNode.move;
            console.log('m', m);

            this.game.makeMove(m);
            this.gameComponent.displayedMoveIndex++;
            this.gameComponent.drawBoard();
            this.colorToPlay = this.game.turn;
        }, 1000);
    }

    // private setupEndgameTrainingSet(exercise: Exercise): void {
    //     const emptyBoardFEN = '8/8/8/8/8/8/8/8 b - - 0 1';
    //     this.game.fen = emptyBoardFEN;
    //     this.game.loadFEN();
    //     exercise.setup(this.game);
    //     this.game.updateFENPiecesPositionsFromBoard();
    //     this.gameComponent.initPosition = this.game.board;
    //     const firstMoveNotation = this.currentExercise.nextMove(this.game);
    //     this.gameComponent.drawBoard();
    //     setTimeout(() => {
    //         this.game.makeMove(firstMoveNotation);
    //         this.gameComponent.displayedMoveIndex++;
    //         this.gameComponent.drawBoard();
    //         this._colorToPlay = this.game.turn;
    //     }, 1000);
    // }

    public boardOverlayEvent(event: string): void {
        console.log('board overlay event', event);
        switch (event) {
            case 'Retry Exercise':
                // this.game.moveHistory = [];
                // this.gameComponent.initPosition = this.game.board;

                // this.gameComponent.drawBoard();
                this.setupPuzzle(this.currentPuzzleIndex);
                break;
            default:
                break;
        }
        // turn off board overlay
        this.showBoardOverlay = false;
    }

    public gameDataEvent(event: GameEvent) {
        console.log(event);

        if (event.type === 'move') {
            // if event was a move
            let isCorrectMove = false;
            for (const n of this.currentPuzzleNode.nextNodes) {
                console.log(n.move, event.content);

                if (n.move === event.content) {
                    this._currentPuzzleNode = n;
                    isCorrectMove = true;
                    break;
                }
            }
            if (isCorrectMove) {
                if (this.currentPuzzleNode.nextNodes.length === 0) {
                    // reset
                    setTimeout(() => {
                        this.showBoardOverlay = true;
                    }, 1500);
                } else {
                    // trigger black's move if white's is correct
                    const n =
                        this.currentPuzzleNode.nextNodes.length === 1
                            ? this.currentPuzzleNode.nextNodes[0]
                            : this.currentPuzzleNode.nextNodes[
                                  randomNumberInclusivelyBetween(
                                      0,
                                      this.currentPuzzleNode.nextNodes.length -
                                          1
                                  )
                              ];
                    this.currentPuzzleNode = n;
                    const moveNotation = this.currentPuzzleNode.move;
                    setTimeout(() => {
                        this.game.makeMove(moveNotation);
                        this.gameComponent.displayedMoveIndex++;
                        this.gameComponent.drawBoard();
                    }, 1000);
                }
            } else {
                // move is wrong
                setTimeout(() => {
                    const lastMove = this.game.undoLastMove();
                    if (this.gameComponent.displayedMoveIndex !== 0) {
                        this.gameComponent.displayedMoveIndex--;
                        this.gameComponent.drawBoard();
                    }
                    this.gameComponent.drawBoard();
                    this.gameComponent.flashSquare(
                        lastMove.dest,
                        'red',
                        200,
                        3
                    );
                }, 1000);
            }
        }
    }

    get game(): Game {
        return this._game;
    }
    set game(g: Game) {
        this._game = g;
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
    set showBoardOverlay(flag: boolean) {
        this._showBoardOverlay = flag;
    }
    // TODO not any
    get boardOverlayData(): any {
        return this._boardOverlayData;
    }
    get colorToPlay(): Color {
        return this._colorToPlay;
    }
    set colorToPlay(c: Color) {
        this._colorToPlay = c;
    }
    get colorToPlayString(): string {
        return colorToString(this.colorToPlay);
    }
    get gameDisplayOptions(): GameDisplayOptions {
        return this._gameDisplayOptions;
    }
    // get checkmateSequences(): Sequence[] {
    //     return this._checkmateSequences;
    // }
    // get currentSequence(): Sequence {
    //     return this._currentSequence;
    // }
    // set currentSequence(seq: Sequence) {
    //     this._currentSequence = seq;
    // }

    get currentPuzzleIndex(): number {
        return this._currentPuzzleIndex;
    }
    set currentPuzzleIndex(i: number) {
        this._currentPuzzleIndex = i;
    }
    get endgamePuzzles(): Puzzle[] {
        return this._endgamePuzzles;
    }
    set endgamePuzzles(puzzles: Puzzle[]) {
        this._endgamePuzzles = puzzles;
    }
    get currentPuzzle(): Puzzle {
        return this.endgamePuzzles[this.currentPuzzleIndex];
    }
    get currentPuzzleNode(): LineNode {
        return this._currentPuzzleNode;
    }
    set currentPuzzleNode(node: LineNode) {
        this._currentPuzzleNode = node;
    }
}
