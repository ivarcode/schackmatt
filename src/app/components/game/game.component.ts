import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
    SimpleChanges,
    OnChanges
} from '@angular/core';
import { Game, Color, Rank, Board } from '../../lib/game.library';
import { GameDisplayOptions, GameEvent } from 'src/app/lib/interface.library';
import { fileToString } from 'src/app/lib/util.library';
import { Square } from 'src/app/lib/square.library';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnChanges {
    @Output() gameDataEmitter = new EventEmitter<GameEvent>();
    @Input() game: Game;
    @Input() interfaceCommand: string;
    @Input() gameDisplayOptions: GameDisplayOptions;

    private displayedMoveIndex: number;
    private boardCanvas: any;
    private boardContext: any;
    private boardImage: any;
    private pieceImages: any[];
    private CURSOR_DATA: {
        mouseIsDown: boolean;
        mouseOverBoard: boolean;
        currentMousePosition: {
            x: number;
            y: number;
        };
        overSquare: {
            x: number;
            y: number;
        };
        mouseDownOn: {
            x: number;
            y: number;
        };
        mouseUpOn: {
            x: number;
            y: number;
        };
        dragging: boolean;
        draggedPieceIndex: number;
    };
    private twoClickMove: {
        attempting: boolean;
        source: {
            x: number;
            y: number;
        };
        preventPromote: boolean;
    };
    private tintSqFromMouseObjects: {
        dest: Square;
        color: string;
        gA: number;
    }[];
    private tintSqData: {
        dest: Square;
        color: string;
        gA: number;
    }[];
    private drawnArrows: {
        fromSquare: Square;
        toSquare: Square;
        color: string;
        displacement: number;
        pointerSize: number;
        lineWidth: number;
    }[];
    private isPromoting: boolean;
    private matchingMoves: any[];
    private initPosition: Board;

    // event listener functions
    private _mouseEnterEventListener: Function = () => {
        // just a detector of when the mouse is over the canvas object
        this.CURSOR_DATA.mouseOverBoard = true;
    };
    private _mouseLeaveEventListener: Function = () => {
        // when mouse exits the canvas object
        this.CURSOR_DATA.mouseOverBoard = false;
        this.CURSOR_DATA.currentMousePosition = { x: -1, y: -1 };
        this.CURSOR_DATA.overSquare = null;
        this.tintSqFromMouseObjects = [];
        this.CURSOR_DATA.draggedPieceIndex = -1;
        this.drawBoard();
    };
    private _mouseMoveEventListener: Function = (events: any) => {
        // condition when not on latest move
        if (this.displayedMoveIndex !== this.game.getMoveHistory().length) {
            return;
        }
        // this function takes the x and y coordinates of mousedata to
        // convert that to a square coordinate
        // we save this in an object to reference when click events happen
        if (this.CURSOR_DATA.mouseOverBoard) {
            this.CURSOR_DATA.currentMousePosition = this.getMousePosition(
                events
            );
            let x = this.CURSOR_DATA.currentMousePosition.x;
            let y = this.CURSOR_DATA.currentMousePosition.y;
            x -= x % 80;
            y -= y % 80;
            x /= 80;
            y /= 80;
            if (
                this.CURSOR_DATA.overSquare === null ||
                this.CURSOR_DATA.overSquare.x !== x ||
                this.CURSOR_DATA.overSquare.y !== y
            ) {
                // console.log('xy', x, y);
                // ooh tslint taught me shorthand
                this.CURSOR_DATA.overSquare = { x, y };
                this.showMoves();
            }
        }
        this.drawBoard();
    };
    private _mouseDownEventListener: Function = (e) => {
        // condition when not on latest move
        if (this.displayedMoveIndex !== this.game.getMoveHistory().length) {
            return;
        }
        // when mouse is pressed down
        this.CURSOR_DATA.mouseIsDown = true;
        if (this.CURSOR_DATA.overSquare) {
            this.CURSOR_DATA.mouseDownOn = this.CURSOR_DATA.overSquare;
            if (e.which == 1) {
                // mouse left click
                this.drawnArrows = [];
                if (!this.isPromoting) {
                    this.CURSOR_DATA.dragging = true;
                }
                if (this.twoClickMove.attempting) {
                    this.CURSOR_DATA.mouseUpOn = this.CURSOR_DATA.mouseDownOn;
                    this.CURSOR_DATA.mouseDownOn = this.twoClickMove.source;
                    this.attemptMoveOnBoard();
                    this.twoClickMove.attempting = false;
                    this.twoClickMove.source = null;
                    this.CURSOR_DATA.mouseDownOn = this.CURSOR_DATA.overSquare;
                    this.tintSqFromMouseObjects = [];
                    this.drawBoard();
                    this.showMoves();
                } else {
                    this.twoClickMove.attempting = false;
                    this.twoClickMove.source = null;
                }
            }
        } else {
            throw new Error('mouse down not over sq');
        }
    };
    private _mouseUpEventListener: Function = (e) => {
        // condition when not on latest move
        if (this.displayedMoveIndex !== this.game.getMoveHistory().length) {
            return;
        }
        // when mouse is released
        this.CURSOR_DATA.mouseIsDown = false;
        if (this.isPromoting) {
            if (
                !this.twoClickMove.attempting &&
                !this.twoClickMove.preventPromote
            ) {
                if (this.CURSOR_DATA.overSquare) {
                    const overSq = this.CURSOR_DATA.overSquare;
                    this.CURSOR_DATA.mouseUpOn = overSq;
                    if (
                        this.CURSOR_DATA.mouseDownOn.x ===
                            this.CURSOR_DATA.mouseUpOn.x &&
                        this.CURSOR_DATA.mouseDownOn.y ===
                            this.CURSOR_DATA.mouseUpOn.y
                    ) {
                        // console.log('', this.matchingMoves);
                        const f = this.CURSOR_DATA.mouseDownOn.x;
                        const r = 7 - this.CURSOR_DATA.mouseDownOn.y;
                        if (f === this.matchingMoves[0].dest.file) {
                            if (this.game.getTurn() === Color.White) {
                                if (r === Rank.EIGHT) {
                                    this.game.makeMove(
                                        this.matchingMoves[0].notation
                                    );
                                    this.displayedMoveIndex++;
                                    this.gameDataEmitter.emit({
                                        type: 'move',
                                        content: this.matchingMoves[0].notation
                                    });
                                } else if (r === Rank.SEVEN) {
                                    this.game.makeMove(
                                        this.matchingMoves[3].notation
                                    );
                                    this.displayedMoveIndex++;
                                    this.gameDataEmitter.emit({
                                        type: 'move',
                                        content: this.matchingMoves[3].notation
                                    });
                                } else if (r === Rank.SIX) {
                                    this.game.makeMove(
                                        this.matchingMoves[1].notation
                                    );
                                    this.displayedMoveIndex++;
                                    this.gameDataEmitter.emit({
                                        type: 'move',
                                        content: this.matchingMoves[1].notation
                                    });
                                } else if (r === Rank.FIVE) {
                                    this.game.makeMove(
                                        this.matchingMoves[2].notation
                                    );
                                    this.displayedMoveIndex++;
                                    this.gameDataEmitter.emit({
                                        type: 'move',
                                        content: this.matchingMoves[2].notation
                                    });
                                }
                            } else {
                                if (r === Rank.ONE) {
                                    this.game.makeMove(
                                        this.matchingMoves[0].notation
                                    );
                                    this.displayedMoveIndex++;
                                    this.gameDataEmitter.emit({
                                        type: 'move',
                                        content: this.matchingMoves[0].notation
                                    });
                                } else if (r === Rank.TWO) {
                                    this.game.makeMove(
                                        this.matchingMoves[3].notation
                                    );
                                    this.displayedMoveIndex++;
                                    this.gameDataEmitter.emit({
                                        type: 'move',
                                        content: this.matchingMoves[3].notation
                                    });
                                } else if (r === Rank.THREE) {
                                    this.game.makeMove(
                                        this.matchingMoves[1].notation
                                    );
                                    this.displayedMoveIndex++;
                                    this.gameDataEmitter.emit({
                                        type: 'move',
                                        content: this.matchingMoves[1].notation
                                    });
                                } else if (r === Rank.FOUR) {
                                    this.game.makeMove(
                                        this.matchingMoves[2].notation
                                    );
                                    this.displayedMoveIndex++;
                                    this.gameDataEmitter.emit({
                                        type: 'move',
                                        content: this.matchingMoves[2].notation
                                    });
                                }
                            }
                        }
                        this.isPromoting = false;
                        this.matchingMoves = [];
                    }
                }
            } else {
                this.twoClickMove.preventPromote = false;
            }
        } else {
            if (this.CURSOR_DATA.overSquare) {
                this.CURSOR_DATA.mouseUpOn = this.CURSOR_DATA.overSquare;
                if (
                    this.CURSOR_DATA.mouseDownOn.x ===
                        this.CURSOR_DATA.mouseUpOn.x &&
                    this.CURSOR_DATA.mouseDownOn.y ===
                        this.CURSOR_DATA.mouseUpOn.y
                ) {
                    if (
                        this.game.getPiece(
                            new Square(
                                this.CURSOR_DATA.mouseDownOn.x,
                                7 - this.CURSOR_DATA.mouseDownOn.y
                            )
                        )?.color === this.game.getTurn()
                    ) {
                        this.twoClickMove.attempting = true;
                        this.twoClickMove.source = this.CURSOR_DATA.mouseUpOn;
                    }
                } else {
                    if (e.which === 1) {
                        // mouse left click
                        this.attemptMoveOnBoard();
                    } else if (e.which === 3) {
                        // mouse right click
                        let unique = true;
                        const newArrow = {
                            fromSquare: new Square(
                                this.CURSOR_DATA.mouseDownOn.x,
                                this.CURSOR_DATA.mouseDownOn.y
                            ),
                            toSquare: new Square(
                                this.CURSOR_DATA.mouseUpOn.x,
                                this.CURSOR_DATA.mouseUpOn.y
                            ),
                            color: '#15781B',
                            displacement: -5,
                            pointerSize: 25,
                            lineWidth: 15
                        };
                        const index = this.drawnArrows.findIndex(
                            (arrow) =>
                                arrow.fromSquare.toString() ===
                                    newArrow.fromSquare.toString() &&
                                arrow.toSquare.toString() ===
                                    newArrow.toSquare.toString()
                        );

                        // delete if arrow already exists, otherwise add
                        if (index !== -1) {
                            this.drawnArrows.splice(index, 1);
                            unique = false;
                        }
                        if (unique) {
                            this.drawnArrows.push(newArrow);
                        }
                    }
                }
            } else {
                throw new Error('mouse up not over sq');
            }
        }
        this.CURSOR_DATA.dragging = false;
        this.CURSOR_DATA.draggedPieceIndex = -1;
        this.drawBoard();
        this.showMoves();
    };

    constructor() {
        // this.game = new Game('1k6/1p6/8/2P5/5p2/4P3/1K6/8 w - - 0 1');
        this.CURSOR_DATA = {
            mouseIsDown: false,
            mouseOverBoard: false,
            currentMousePosition: {
                x: -1,
                y: -1
            },
            overSquare: null,
            mouseDownOn: null,
            mouseUpOn: null,
            dragging: false,
            draggedPieceIndex: -1
        };
        this.twoClickMove = {
            attempting: false,
            source: null,
            preventPromote: false
        };
        this.tintSqFromMouseObjects = [];
        this.drawnArrows = [];
        this.tintSqData = [];
        this.isPromoting = false;
        this.matchingMoves = [];
        this.displayedMoveIndex = 0;

        // console.log(this.game.toString());
        // this.game.printLegalMovesToConsole();
    }

    ngOnInit() {
        this.initPosition = this.game.getBoard();

        this.boardCanvas = document.getElementById('board');
        this.boardCanvas.oncontextmenu = (events: any) => {
            events.preventDefault();
        };
        this.boardContext = this.boardCanvas.getContext('2d');
        this.pieceImages = [];

        // doing pieces first
        const pieceSources = [
            'w_King',
            'w_Queen',
            'w_Bishop',
            'w_Knight',
            'w_Rook',
            'w_Pawn',
            'b_King',
            'b_Queen',
            'b_Bishop',
            'b_Knight',
            'b_Rook',
            'b_Pawn'
        ];
        for (const pieceSrc of pieceSources) {
            const pImg = new Image();
            pImg.src = '../../assets/pieces/' + pieceSrc + '.png';
            this.pieceImages.push(pImg);
        }

        this.boardImage = new Image();
        this.boardImage.src = '../../assets/board_640x640.png';
        // because apparently I have to wait on the image smh
        this.boardImage.onload = () => {
            this.drawBoard();
        };
        // create all the board event listeners
        this.initializeEventListeners();
    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log(changes);
        if (changes.interfaceCommand && changes.interfaceCommand.currentValue) {
            switch (changes.interfaceCommand.currentValue) {
                case 'move made, redraw board':
                    this.displayedMoveIndex++;
                    this.drawBoard();
                    break;
                case 'redraw board':
                    this.drawBoard();
                    break;
                case 'back':
                    if (this.displayedMoveIndex > 0) {
                        this.displayedMoveIndex--;
                    }
                    this.drawBoard();
                    break;
                case 'forward':
                    if (
                        this.displayedMoveIndex <=
                        this.game.getMoveHistory().length - 1
                    ) {
                        this.displayedMoveIndex++;
                    }
                    console.log(
                        this.game.getMoveHistory()[this.displayedMoveIndex]
                    );
                    this.drawBoard();
                    break;
                case 'displayMoveIndex--':
                    this.displayedMoveIndex--;
                    this.drawBoard();
                    break;
                default:
                    const value = changes.interfaceCommand.currentValue;
                    if (value.substr(0, 9) === 'traverse ') {
                        this.setDisplayedMoveIndex(
                            Number.parseInt(value.substr(9), 10)
                        );
                        this.drawBoard();
                        break;
                    }
                    throw new Error(
                        'invalid interface command' +
                            changes.interfaceCommand.currentValue
                    );
            }
            // TODO probably can draw board HERE instead?
        }
    }

    public initializeEventListeners(): void {
        // listeners
        this.boardCanvas.addEventListener(
            'mouseenter',
            this._mouseEnterEventListener
        );
        this.boardCanvas.addEventListener(
            'mouseleave',
            this._mouseLeaveEventListener
        );
        this.boardCanvas.addEventListener(
            'mousemove',
            this._mouseMoveEventListener
        );
        this.boardCanvas.addEventListener(
            'mousedown',
            this._mouseDownEventListener
        );
        this.boardCanvas.addEventListener(
            'mouseup',
            this._mouseUpEventListener
        );
    }

    public removeEventListeners(): void {
        this.boardCanvas.removeEventListener(
            'mouseenter',
            this._mouseEnterEventListener
        );
        this.boardCanvas.removeEventListener(
            'mouseleave',
            this._mouseLeaveEventListener
        );
        this.boardCanvas.removeEventListener(
            'mousemove',
            this._mouseMoveEventListener
        );
        this.boardCanvas.removeEventListener(
            'mousedown',
            this._mouseDownEventListener
        );
        this.boardCanvas.removeEventListener(
            'mouseup',
            this._mouseUpEventListener
        );
    }

    public setDisplayedMoveIndex(index: number): void {
        this.displayedMoveIndex = index;
    }

    public getDisplayedMoveIndex(): number {
        return this.displayedMoveIndex;
    }

    private showMoves(): void {
        const pieceMovements = this.game.getLegalMoves();
        const sq = {
            file: this.CURSOR_DATA.overSquare.x,
            rank: 7 - this.CURSOR_DATA.overSquare.y
        };
        this.tintSqFromMouseObjects = [];
        if (this.twoClickMove.attempting) {
            for (const movement of pieceMovements) {
                if (
                    movement.src.file === this.twoClickMove.source.x &&
                    movement.src.rank === 7 - this.twoClickMove.source.y
                ) {
                    this.tintSqFromMouseObjects.push({
                        dest: new Square(
                            movement.dest.file,
                            7 - movement.dest.rank
                        ),
                        color: 'green',
                        gA: 0.01
                    });
                }
            }
        }
        if (this.CURSOR_DATA.dragging) {
            for (const movement of pieceMovements) {
                if (
                    movement.src.file === this.CURSOR_DATA.mouseDownOn.x &&
                    movement.src.rank === 7 - this.CURSOR_DATA.mouseDownOn.y
                ) {
                    this.tintSqFromMouseObjects.push({
                        dest: new Square(
                            movement.dest.file,
                            7 - movement.dest.rank
                        ),
                        color: 'green',
                        gA: 0.01
                    });
                }
            }
        }
        if (
            !this.isPromoting &&
            !this.twoClickMove.attempting &&
            !this.CURSOR_DATA.dragging
        ) {
            for (const movement of pieceMovements) {
                if (
                    movement.src.file === sq.file &&
                    movement.src.rank === sq.rank
                ) {
                    this.tintSqFromMouseObjects.push({
                        dest: new Square(
                            movement.dest.file,
                            7 - movement.dest.rank
                        ),
                        color: 'green',
                        gA: 0.01
                    });
                }
            }
        }
        if (this.game.isCheck()) {
            const kingSq = this.game.findKing(this.game.getTurn());
            this.tintSqFromMouseObjects.push({
                dest: new Square(kingSq.file, 7 - kingSq.rank),
                color: 'red',
                gA: 0.01
            });
        }
    }

    private attemptMoveOnBoard(): void {
        // checking the original pgn to see if it changes
        const originalPGN = this.getGame().getPGN();

        // does not matter what the resulting board is here,
        // we are just passing the src and dest
        const legalMoves = this.game.getLegalMoves();
        for (const move of legalMoves) {
            move.notation = this.game.getNotation(move);
        }
        // console.log('legalmoves', legalMoves);

        // check for queening

        for (const move of legalMoves) {
            if (
                move.src.file === this.CURSOR_DATA.mouseDownOn.x &&
                move.src.rank === 7 - this.CURSOR_DATA.mouseDownOn.y &&
                move.dest.file === this.CURSOR_DATA.mouseUpOn.x &&
                move.dest.rank === 7 - this.CURSOR_DATA.mouseUpOn.y
            ) {
                this.matchingMoves.push(move);
            }
        }
        if (this.matchingMoves.length === 1) {
            this.game.makeMove(this.matchingMoves[0].notation);
            this.displayedMoveIndex++;
            // checking if changed
            if (originalPGN !== this.getGame().getPGN()) {
                this.gameDataEmitter.emit({
                    type: 'move',
                    content: this.matchingMoves[0].notation
                });
            }
            // clearing the matchingMoves array
            this.matchingMoves = [];
        } else if (this.matchingMoves.length === 0) {
            // console.log('invalid move attempted');
        } else {
            this.isPromoting = true;
            if (this.CURSOR_DATA.mouseIsDown) {
                this.twoClickMove.preventPromote = true;
            } else {
                this.twoClickMove.preventPromote = false;
            }
        }
    }

    private getMousePosition(events: any): { x: number; y: number } {
        let obj = this.boardCanvas;
        let top = 0;
        let left = 0;
        let mX = 0;
        let mY = 0;
        while (obj && obj.tagName !== 'BODY') {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }
        mX = events.clientX - left + window.pageXOffset;
        mY = events.clientY - top + window.pageYOffset;
        return { x: mX, y: mY };
    }

    public drawBoard(): void {
        this.boardContext.restore();
        this.boardContext.globalAlpha = 1;
        // this.boardContext.drawImage(this.boardImage, 0, 0);
        this.boardContext.font = '15px Arial';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.boardContext.fillStyle =
                    (i + j) % 2 === 0
                        ? this.gameDisplayOptions.colorScheme.light
                        : this.gameDisplayOptions.colorScheme.dark;
                this.boardContext.fillRect(i * 80, j * 80, 80, 80);
            }
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.refreshCanvasSquare(i, j);
            }
        }
        if (this.gameDisplayOptions.showCoordinates) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if ((i + j) % 2 === 0) {
                        // light sq
                        this.boardContext.fillStyle = this.gameDisplayOptions.colorScheme.dark;
                    } else {
                        // dark sq
                        this.boardContext.fillStyle = this.gameDisplayOptions.colorScheme.light;
                    }
                    if (i === 7) {
                        // right side
                        this.boardContext.fillText(
                            '' + (8 - j),
                            628,
                            j * 80 + 15
                        );
                    }
                    if (j === 7) {
                        // bottom row
                        this.boardContext.fillText(
                            fileToString(i),
                            i * 80 + 5,
                            635
                        );
                    }
                }
            }
        }
        this.drawArrows();
        this.boardContext.globalAlpha = 1;
        if (this.CURSOR_DATA.draggedPieceIndex !== -1) {
            this.boardContext.drawImage(
                this.pieceImages[this.CURSOR_DATA.draggedPieceIndex],
                this.CURSOR_DATA.currentMousePosition.x - 40,
                this.CURSOR_DATA.currentMousePosition.y - 40
            );
        }
        if (this.isPromoting) {
            this.boardContext.globalAlpha = 0.5;
            this.boardContext.fillStyle = 'black';
            this.boardContext.fillRect(0, 0, 640, 640);
            this.boardContext.globalAlpha = 1;
            const x = this.matchingMoves[0].dest.file;
            this.boardContext.fillStyle = '#AAAAAA';
            if (this.game.getTurn() === Color.White) {
                this.boardContext.fillRect(x * 80, 0, 80, 320);
                this.boardContext.drawImage(this.pieceImages[1], x * 80, 0);
                this.boardContext.drawImage(this.pieceImages[3], x * 80, 80);
                this.boardContext.drawImage(this.pieceImages[4], x * 80, 160);
                this.boardContext.drawImage(this.pieceImages[2], x * 80, 240);
            } else {
                this.boardContext.fillRect(x * 80, 320, 80, 320);
                this.boardContext.drawImage(this.pieceImages[7], x * 80, 560);
                this.boardContext.drawImage(this.pieceImages[9], x * 80, 480);
                this.boardContext.drawImage(this.pieceImages[10], x * 80, 400);
                this.boardContext.drawImage(this.pieceImages[8], x * 80, 320);
            }
        }
    }

    private refreshCanvasSquare(x: number, y: number): void {
        const piece =
            this.displayedMoveIndex === 0
                ? this.initPosition.getPiece(new Square(x, y))
                : this.game
                      .getMoveHistory()
                      [this.displayedMoveIndex - 1].resultingBoard.getPiece(
                          new Square(x, y)
                      );
        if (this.displayedMoveIndex !== 0) {
            let lastMove = this.game.getMoveHistory()[
                this.displayedMoveIndex - 1
            ];
            if (
                (lastMove.src.file === x && lastMove.src.rank === y) ||
                (lastMove.dest.file === x && lastMove.dest.rank === y)
            ) {
                this.tintSquare(x, 7 - y, 'yellow', 0.5);
            }
        }
        if (
            this.CURSOR_DATA.overSquare &&
            this.CURSOR_DATA.overSquare.x === x &&
            this.CURSOR_DATA.overSquare.y === 7 - y &&
            !this.isPromoting &&
            !(
                this.twoClickMove.source &&
                this.CURSOR_DATA.overSquare.x === this.twoClickMove.source.x &&
                this.CURSOR_DATA.overSquare.y === this.twoClickMove.source.y
            )
        ) {
            this.tintSquare(x, 7 - y, 'gray', 0.5);
            this.boardContext.globalAlpha = 1; // reset this to full
        }
        if (
            this.twoClickMove.attempting &&
            x === this.twoClickMove.source.x &&
            7 - y === this.twoClickMove.source.y
        ) {
            this.tintSquare(
                this.twoClickMove.source.x,
                this.twoClickMove.source.y,
                'yellow',
                0.5
            );
            this.boardContext.globalAlpha = 1; // reset this to full
            if (piece) {
                const color = piece.color;
                const pieceType = piece.type;
                const index = (color ? 6 : 0) + pieceType;
                this.boardContext.drawImage(
                    this.pieceImages[index],
                    x * 80,
                    (7 - y) * 80
                );
            }
        }
        for (const tintSq of this.tintSqObjects) {
            this.tintSquare(
                tintSq.dest.file,
                tintSq.dest.rank,
                tintSq.color,
                tintSq.gA
            );
        }
        this.boardContext.globalAlpha = 1;
        if (piece) {
            const color = piece.color;
            const pieceType = piece.type;
            const index = (color === 1 ? 6 : 0) + pieceType;
            if (
                this.CURSOR_DATA.dragging &&
                this.CURSOR_DATA.mouseDownOn.x === x &&
                this.CURSOR_DATA.mouseDownOn.y === 7 - y
            ) {
                this.CURSOR_DATA.draggedPieceIndex = index;
            } else {
                this.boardContext.drawImage(
                    this.pieceImages[index],
                    x * 80,
                    (7 - y) * 80
                );
            }
        }
    }

    private tintSquare(
        x: number,
        y: number,
        color: string,
        globalAlpha: number
    ): void {
        this.boardContext.globalAlpha = globalAlpha;
        this.boardContext.fillStyle = color;
        this.boardContext.fillRect(x * 80, y * 80, 80, 80);
    }

    public getGame(): Game {
        return this.game;
    }

    public setInitPosition(board: Board): void {
        this.initPosition = board;
    }

    // TODO refactor
    get tintSqObjects(): any[] {
        return [...this.tintSqFromMouseObjects, ...this.tintSqData];
    }

    public flashSquare(
        sq: Square,
        color: string,
        milliDuration: number,
        times: number
    ): void {
        if (times < 1) {
            return;
        }
        let redTint = {
            dest: new Square(sq.file, 7 - sq.rank),
            color: color,
            gA: 0.5
        };
        this.tintSqData.push(redTint);
        this.drawBoard();
        setTimeout(() => {
            this.tintSqData.splice(this.tintSqData.indexOf(redTint));
            this.drawBoard();
            setTimeout(() => {
                this.flashSquare(sq, color, milliDuration, times - 1);
            }, milliDuration);
        }, milliDuration);
    }

    private drawArrows(): void {
        this.boardContext.globalAlpha = 0.5;
        for (const arrow of this.drawnArrows) {
            const fromX = arrow.fromSquare.file * 80 + 40;
            const fromY = arrow.fromSquare.rank * 80 + 40;
            const toX = arrow.toSquare.file * 80 + 40;
            const toY = arrow.toSquare.rank * 80 + 40;
            const color = arrow.color;
            // pointer displacement from the center
            const displacement = arrow.displacement;
            // radius of the circumcircle of the triangle pointer
            const r = arrow.pointerSize;
            const lineWidth = arrow.lineWidth;

            // imaginary triangle - hypotenuse goes from origin sq to dest sq
            const angle = Math.atan2(toY - fromY, toX - fromX);
            const hypotenuse =
                Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2) +
                displacement;
            this.boardContext.save();
            this.boardContext.translate(fromX, fromY);
            this.boardContext.rotate(angle);

            // draws the line
            this.boardContext.beginPath();
            this.boardContext.moveTo(0, 0);
            this.boardContext.lineTo(hypotenuse - r, 0);
            this.boardContext.lineWidth = lineWidth;
            this.boardContext.strokeStyle = color;
            this.boardContext.stroke();

            // draws the triangle pointer
            this.boardContext.beginPath();
            this.boardContext.lineTo(hypotenuse - r, r);
            this.boardContext.lineTo(hypotenuse, 0);
            this.boardContext.lineTo(hypotenuse - r, -r);
            this.boardContext.fillStyle = color;
            this.boardContext.fill();
            this.boardContext.restore();
        }
    }
}
