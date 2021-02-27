import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Game } from 'src/app/lib/game.library';
import {
    GameConfig,
    GameEvent,
    LineNode,
    Puzzle
} from 'src/app/lib/interface.library';
import {
    Color,
    colorToString,
    oppositeColor,
    parseLichessStudies,
    randomNumberInclusivelyBetween
} from 'src/app/lib/util.library';
import { GameComponent } from '../game/game.component';
import { basic_checkmates } from 'data/basic_checkmates.json';

@Component({
    selector: 'app-puzzles',
    templateUrl: './puzzles.component.html',
    styleUrls: ['./puzzles.component.css']
})
export class PuzzlesComponent implements OnInit, AfterViewInit {
    @ViewChild('gameComponent') _gameComponent: GameComponent;
    private _gameConfig: GameConfig;
    private _game: Game;
    private _showBoardOverlay: boolean;
    private _boardOverlayData: {
        title: string;
        displayLoadingMessage: boolean;
        detailedMessage: string;
        displayButtons: string[];
    };
    private _colorToPlay: Color;

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
        this._gameConfig = {
            restrictPieces: [],
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
    }

    ngOnInit() {
        // this could also go in constructor I suppose
        this.game = new Game();
    }

    ngAfterViewInit() {
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

        this.colorToPlay = oppositeColor(this.game.turn);
        this.gameConfig.orientation = this.colorToPlay;
        this.gameConfig.restrictPieces = [this.game.turn];

        this.gameComponent.drawBoard();
        this.game.moveHistory = [];

        setTimeout(() => {
            this.currentPuzzleNode = this.currentPuzzleNode.nextNodes[0];
            const m = this.currentPuzzleNode.move;
            console.log('m', m);

            this.game.makeMove(m);
            this.gameComponent.displayedMoveIndex++;
            this.gameComponent.drawBoard();
        }, 1000);
    }

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
    get gameConfig(): GameConfig {
        return this._gameConfig;
    }
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
