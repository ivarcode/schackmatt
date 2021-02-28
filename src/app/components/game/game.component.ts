import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
    SimpleChanges,
    OnChanges
} from '@angular/core';
import { Game } from '../../lib/game.library';
import { GameConfig, GameEvent } from 'src/app/lib/interface.library';
import { fileToString, Color, RANK } from 'src/app/lib/util.library';
import { Square } from 'src/app/lib/square.library';
import { Board } from 'src/app/lib/board.library';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnChanges {
    @Output() gameDataEmitter = new EventEmitter<GameEvent>();
    @Input() game: Game;
    @Input() interfaceCommand: string;
    @Input() config: GameConfig;

    private displayedMoveIndex: number;
    private boardCanvas: any;
    private _boardCtx: any;
    private boardImage: any;
    private pieceImages: any[];
    private cursor: {
        leftMouseIsDown: boolean;
        rightMouseIsDown: boolean;
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
    private isPromoting: boolean;
    private matchingMoves: any[];
    private initPosition: Board;

    // event listener functions
    private _mouseEnterEventListener: (event: any) => void;
    private _mouseLeaveEventListener: () => void;
    private _mouseMoveEventListener: (event: any) => void;
    private _mouseDownEventListener: (event: any) => void;
    private _mouseUpEventListener: (event: any) => void;

    constructor() {
        // this.game = new Game('1k6/1p6/8/2P5/5p2/4P3/1K6/8 w - - 0 1');
        this.cursor = {
            leftMouseIsDown: false,
            rightMouseIsDown: false,
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
        this.tintSqData = [];
        this.isPromoting = false;
        this.matchingMoves = [];
        this.displayedMoveIndex = 0;

        this._mouseEnterEventListener = (event: any) => {
            // just a detector of when the mouse is over the canvas object
            this.cursor.mouseOverBoard = true;
            // if mouse was down end that "drag drop event" if the mouse isn't
            // still down
            if (this.cursor.leftMouseIsDown) {
                if (event.buttons === 0 || event.which !== 1) {
                    // pause here, but this is where we put the "mouse back up"
                    // left button
                    this.cursor.leftMouseIsDown = false;
                    this.cursor.dragging = false;
                    this.cursor.draggedPieceIndex = -1;
                    this.drawBoard();
                    // this block is the same logic in mouseUpEvent but without
                    // the action of doing a bunch of promotion / make move
                    // checking
                }
            }
        };
        this._mouseLeaveEventListener = () => {
            // when mouse exits the canvas object
            this.cursor.mouseOverBoard = false;
            this.cursor.currentMousePosition = { x: -1, y: -1 };
            this.cursor.overSquare = null;
            this.tintSqFromMouseObjects = [];
            this.cursor.draggedPieceIndex = -1;
            this.drawBoard();
        };
        this._mouseMoveEventListener = (event: any) => {
            this.mouseEventOrientationResolver(event);
        };
        this._mouseDownEventListener = (event: any) => {
            // condition when not on latest move
            if (this.displayedMoveIndex !== this.game.moveHistory.length) {
                return;
            }
            // when mouse is pressed down
            if (event.which === 1) {
                // left button
                this.cursor.leftMouseIsDown = true;

                if (this.cursor.overSquare) {
                    this.cursor.mouseDownOn = this.cursor.overSquare;
                    if (!this.isPromoting) {
                        this.cursor.dragging = true;
                    }
                    if (this.twoClickMove.attempting) {
                        // second move
                        this.cursor.mouseUpOn = this.cursor.mouseDownOn;
                        this.cursor.mouseDownOn = this.twoClickMove.source;
                        this.attemptMoveOnBoard();
                        this.twoClickMove.attempting = false;
                        this.twoClickMove.source = null;
                        this.cursor.mouseDownOn = this.cursor.overSquare;
                        this.tintSqFromMouseObjects = [];
                        this.drawBoard();
                        this.showMoves();
                    } else {
                        this.twoClickMove.attempting = false;
                        this.twoClickMove.source = null;
                    }
                } else {
                    throw new Error('mouse down not over sq');
                }
            } else if (event.which === 3) {
                // right button
                this.cursor.rightMouseIsDown = true;

                // logic for right mouse pressed DOWN event here
            }
        };
        this._mouseUpEventListener = (event: any) => {
            // condition when not on latest move
            if (this.displayedMoveIndex !== this.game.moveHistory.length) {
                return;
            }
            // when mouse is released
            if (event.which === 1) {
                // left button
                this.cursor.leftMouseIsDown = false;

                // left mouse RELEASE logic here
                if (this.isPromoting) {
                    if (
                        !this.twoClickMove.attempting &&
                        !this.twoClickMove.preventPromote
                    ) {
                        if (this.cursor.overSquare) {
                            const overSq = this.cursor.overSquare;
                            this.cursor.mouseUpOn = overSq;
                            if (
                                this.cursor.mouseDownOn.x ===
                                    this.cursor.mouseUpOn.x &&
                                this.cursor.mouseDownOn.y ===
                                    this.cursor.mouseUpOn.y
                            ) {
                                // console.log('', this.matchingMoves);
                                const f = this.cursor.mouseDownOn.x;
                                const r = 7 - this.cursor.mouseDownOn.y;
                                if (f === this.matchingMoves[0].dest.file) {
                                    if (this.game.turn === Color.White) {
                                        if (r === RANK.EIGHT) {
                                            this.game.makeMove(
                                                this.matchingMoves[0].notation
                                            );
                                            this.displayedMoveIndex++;
                                            this.gameDataEmitter.emit({
                                                type: 'move',
                                                content: this.matchingMoves[0]
                                                    .notation
                                            });
                                        } else if (r === RANK.SEVEN) {
                                            this.game.makeMove(
                                                this.matchingMoves[3].notation
                                            );
                                            this.displayedMoveIndex++;
                                            this.gameDataEmitter.emit({
                                                type: 'move',
                                                content: this.matchingMoves[3]
                                                    .notation
                                            });
                                        } else if (r === RANK.SIX) {
                                            this.game.makeMove(
                                                this.matchingMoves[1].notation
                                            );
                                            this.displayedMoveIndex++;
                                            this.gameDataEmitter.emit({
                                                type: 'move',
                                                content: this.matchingMoves[1]
                                                    .notation
                                            });
                                        } else if (r === RANK.FIVE) {
                                            this.game.makeMove(
                                                this.matchingMoves[2].notation
                                            );
                                            this.displayedMoveIndex++;
                                            this.gameDataEmitter.emit({
                                                type: 'move',
                                                content: this.matchingMoves[2]
                                                    .notation
                                            });
                                        }
                                    } else {
                                        if (r === RANK.ONE) {
                                            this.game.makeMove(
                                                this.matchingMoves[0].notation
                                            );
                                            this.displayedMoveIndex++;
                                            this.gameDataEmitter.emit({
                                                type: 'move',
                                                content: this.matchingMoves[0]
                                                    .notation
                                            });
                                        } else if (r === RANK.TWO) {
                                            this.game.makeMove(
                                                this.matchingMoves[3].notation
                                            );
                                            this.displayedMoveIndex++;
                                            this.gameDataEmitter.emit({
                                                type: 'move',
                                                content: this.matchingMoves[3]
                                                    .notation
                                            });
                                        } else if (r === RANK.THREE) {
                                            this.game.makeMove(
                                                this.matchingMoves[1].notation
                                            );
                                            this.displayedMoveIndex++;
                                            this.gameDataEmitter.emit({
                                                type: 'move',
                                                content: this.matchingMoves[1]
                                                    .notation
                                            });
                                        } else if (r === RANK.FOUR) {
                                            this.game.makeMove(
                                                this.matchingMoves[2].notation
                                            );
                                            this.displayedMoveIndex++;
                                            this.gameDataEmitter.emit({
                                                type: 'move',
                                                content: this.matchingMoves[2]
                                                    .notation
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
                    if (this.cursor.overSquare) {
                        this.cursor.mouseUpOn = this.cursor.overSquare;
                        if (
                            this.cursor.mouseDownOn.x ===
                                this.cursor.mouseUpOn.x &&
                            this.cursor.mouseDownOn.y ===
                                this.cursor.mouseUpOn.y &&
                            this.game.getPiece(
                                new Square(
                                    this.cursor.mouseDownOn.x,
                                    7 - this.cursor.mouseDownOn.y
                                )
                            ) &&
                            this.game.getPiece(
                                new Square(
                                    this.cursor.mouseDownOn.x,
                                    7 - this.cursor.mouseDownOn.y
                                )
                            ).color === this.game.turn
                        ) {
                            this.twoClickMove.attempting = true;
                            this.twoClickMove.source = this.cursor.mouseUpOn;
                        } else {
                            this.attemptMoveOnBoard();
                        }
                    } else {
                        throw new Error('mouse up not over sq');
                    }
                }
                this.cursor.dragging = false;
                this.cursor.draggedPieceIndex = -1;
                this.drawBoard();
                this.showMoves();
            } else if (event.which === 3) {
                // right button
                this.cursor.rightMouseIsDown = false;

                // right mouse RELEASE logic here
            }
        };
        // console.log(this.game.toString());
        // this.game.printLegalMovesToConsole();
    }

    ngOnInit() {
        this.initPosition = this.game.board;

        this.boardCanvas = document.getElementById('board');
        this.boardCanvas.oncontextmenu = (events: any) => {
            events.preventDefault();
        };
        this._boardCtx = this.boardCanvas.getContext('2d');
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
                        this.game.moveHistory.length - 1
                    ) {
                        this.displayedMoveIndex++;
                    }
                    console.log(this.game.moveHistory[this.displayedMoveIndex]);
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

    /**
     * @description returns the mouse event, if necessary, with inverted x,y
     * @param event - mouse event
     * @returns any - event
     */
    private mouseEventOrientationResolver(event: any): any {
        // invert x,y if private input variable indicates our orientation
        // should be flipped
        const e = {
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };
        /**
         * keep the offset within the bounds of 1 && 640 - 1 ... canvas event
         * objects have a tendency to spit out weird stuff sometimes, like -0
         */
        if (e.offsetX < 1) {
            e.offsetX = 1;
        }
        if (e.offsetY < 1) {
            e.offsetY = 1;
        }
        if (e.offsetX > 640 - 1) {
            e.offsetX = 640 - 1;
        }
        if (e.offsetY > 640 - 1) {
            e.offsetY = 640 - 1;
        }

        if (this.config.orientation === Color.Black) {
            e.offsetX = 640 - e.offsetX;
            e.offsetY = 640 - e.offsetY;
        }
        this.mouseMoveEvent(e);
    }

    private mouseMoveEvent(event: any) {
        // condition when not on latest move
        if (this.displayedMoveIndex !== this.game.moveHistory.length) {
            return;
        }
        // this function takes the x and y coordinates of mousedata to
        // convert that to a square coordinate
        // we save this in an object to reference when click events happen
        if (this.cursor.mouseOverBoard) {
            this.cursor.currentMousePosition = this.getMousePosition(event);
            let x = this.cursor.currentMousePosition.x;
            let y = this.cursor.currentMousePosition.y;
            x -= x % 80;
            y -= y % 80;
            x /= 80;
            y /= 80;
            if (
                this.cursor.overSquare === null ||
                this.cursor.overSquare.x !== x ||
                this.cursor.overSquare.y !== y
            ) {
                // console.log('xy', x, y);
                // ooh tslint taught me shorthand
                this.cursor.overSquare = { x, y };
                this.showMoves();
            }
        }
        this.drawBoard();
    }

    public setDisplayedMoveIndex(index: number): void {
        this.displayedMoveIndex = index;
    }

    public getDisplayedMoveIndex(): number {
        return this.displayedMoveIndex;
    }

    private showMoves(): void {
        const pieceMovements = this.game.getLegalMoves();
        const sq = new Square(
            this.cursor.overSquare.x,
            7 - this.cursor.overSquare.y
        );
        // error if restricted
        if (
            this.game.getPiece(sq) &&
            this.config.restrictPieces.includes(
                this.getGame().getPiece(sq).color
            )
        ) {
            // console.error(
            //     'Not showing moves for ' +
            //         this.getGame().getPiece(sq).color +
            //         ' pieces.'
            // );
            return;
        }
        this.tintSqFromMouseObjects = [];
        if (this.twoClickMove.attempting) {
            for (const movement of pieceMovements) {
                if (
                    !this.config.restrictPieces.includes(
                        this.game.getPiece(movement.src).color
                    ) &&
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
        if (this.cursor.dragging) {
            for (const movement of pieceMovements) {
                if (
                    !this.config.restrictPieces.includes(
                        this.game.getPiece(movement.src).color
                    ) &&
                    movement.src.file === this.cursor.mouseDownOn.x &&
                    movement.src.rank === 7 - this.cursor.mouseDownOn.y
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
            !this.cursor.dragging
        ) {
            for (const movement of pieceMovements) {
                if (
                    !this.config.restrictPieces.includes(
                        this.game.getPiece(movement.src).color
                    ) &&
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
            const kingSq = this.game.findKing(this.game.turn);
            this.tintSqFromMouseObjects.push({
                dest: new Square(kingSq.file, 7 - kingSq.rank),
                color: 'red',
                gA: 0.01
            });
        }
    }

    private attemptMoveOnBoard(): void {
        // checking the original pgn to see if it changes
        const originalPGN = this.getGame().pgn;

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
                move.src.file === this.cursor.mouseDownOn.x &&
                move.src.rank === 7 - this.cursor.mouseDownOn.y &&
                move.dest.file === this.cursor.mouseUpOn.x &&
                move.dest.rank === 7 - this.cursor.mouseUpOn.y
            ) {
                this.matchingMoves.push(move);
            }
        }
        if (this.matchingMoves.length === 1) {
            // error if restricted
            if (this.config.restrictPieces.includes(this.getGame().turn)) {
                console.error(
                    'Not allowed to move ' +
                        this.getGame().turn +
                        ' color pieces.'
                );
                return;
            }
            this.game.makeMove(this.matchingMoves[0].notation);
            this.displayedMoveIndex++;
            // checking if changed
            if (originalPGN !== this.getGame().pgn) {
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
            // error if restricted
            if (this.config.restrictPieces.includes(this.getGame().turn)) {
                console.error(
                    'Not allowed to move ' +
                        this.getGame().turn +
                        ' color pieces.'
                );
                return;
            }
            this.isPromoting = true;
            if (this.cursor.leftMouseIsDown) {
                this.twoClickMove.preventPromote = true;
            } else {
                this.twoClickMove.preventPromote = false;
            }
        }
    }

    private getMousePosition(event: any): { x: number; y: number } {
        const mX = event.offsetX;
        const mY = event.offsetY;
        return { x: mX, y: mY };
    }

    public drawBoard(): void {
        this.boardCtx.restore();
        this.boardCtx.globalAlpha = 1;
        // this.boardCtx.drawImage(this.boardImage, 0, 0);
        this.boardCtx.font = '15px Arial';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // no need to invert this if config.orientation is black
                this.boardCtx.fillStyle =
                    (i + j) % 2 === 0
                        ? this.config.colorScheme.light
                        : this.config.colorScheme.dark;
                this.boardCtx.fillRect(i * 80, j * 80, 80, 80);
            }
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.refreshCanvasSquare(i, j);
            }
        }
        if (this.config.showCoordinates) {
            this.drawCoordinates();
        }
        this.boardCtx.globalAlpha = 1;
        if (
            this.cursor.draggedPieceIndex !== -1 &&
            this.cursor.mouseOverBoard
        ) {
            let x = this.cursor.currentMousePosition.x;
            let y = this.cursor.currentMousePosition.y;
            if (this.config.orientation === Color.Black) {
                x = 640 - 1 - x;
                y = 640 - 1 - y;
            }
            this.boardCtx.drawImage(
                this.pieceImages[this.cursor.draggedPieceIndex],
                x - 40,
                y - 40
            );
        }
        if (this.isPromoting) {
            this.boardCtx.globalAlpha = 0.5;
            this.boardCtx.fillStyle = 'black';
            this.boardCtx.fillRect(0, 0, 640, 640);
            this.boardCtx.globalAlpha = 1;
            // this is where we do the invert trickery
            let drawAtTopOfBoard = this.game.turn === Color.White;
            let x = this.matchingMoves[0].dest.file;
            if (this.config.orientation === Color.Black) {
                // flip
                drawAtTopOfBoard = !drawAtTopOfBoard;
                x = 7 - x;
            }
            this.boardCtx.fillStyle = '#AAAAAA';
            this.boardCtx.fillRect(
                x * 80,
                drawAtTopOfBoard ? 0 : 80 * 4,
                80,
                80 * 4
            );
            const _4ys = drawAtTopOfBoard
                ? [0, 80, 80 * 2, 80 * 3]
                : [80 * 7, 80 * 6, 80 * 5, 80 * 4];
            if (this.game.turn === Color.White) {
                this.boardCtx.drawImage(this.pieceImages[1], x * 80, _4ys[0]);
                this.boardCtx.drawImage(this.pieceImages[3], x * 80, _4ys[1]);
                this.boardCtx.drawImage(this.pieceImages[4], x * 80, _4ys[2]);
                this.boardCtx.drawImage(this.pieceImages[2], x * 80, _4ys[3]);
            } else {
                this.boardCtx.drawImage(this.pieceImages[7], x * 80, _4ys[0]);
                this.boardCtx.drawImage(this.pieceImages[9], x * 80, _4ys[1]);
                this.boardCtx.drawImage(this.pieceImages[10], x * 80, _4ys[2]);
                this.boardCtx.drawImage(this.pieceImages[8], x * 80, _4ys[3]);
            }
        }
    }

    private drawCoordinates(): void {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // light/dark sq
                this.boardCtx.fillStyle =
                    (i + j) % 2 === 0
                        ? this.config.colorScheme.dark
                        : this.config.colorScheme.light;
                if (i === 7) {
                    // right side
                    this.boardCtx.fillText(
                        '' +
                            (this.config.orientation === Color.White
                                ? 8 - j
                                : j + 1),
                        628,
                        j * 80 + 15
                    );
                }
                if (j === 7) {
                    // bottom row
                    this.boardCtx.fillText(
                        fileToString(
                            this.config.orientation === Color.White ? i : 7 - i
                        ),
                        i * 80 + 5,
                        635
                    );
                }
            }
        }
    }

    private refreshCanvasSquare(x: number, y: number): void {
        const piece =
            this.displayedMoveIndex === 0
                ? this.initPosition.getPiece(new Square(x, y))
                : this.game.moveHistory[
                      this.displayedMoveIndex - 1
                  ].resultingBoard.getPiece(new Square(x, y));
        if (this.displayedMoveIndex !== 0) {
            const lastMove = this.game.moveHistory[this.displayedMoveIndex - 1];
            if (
                (lastMove.src.file === x && lastMove.src.rank === y) ||
                (lastMove.dest.file === x && lastMove.dest.rank === y)
            ) {
                this.tintSquare(x, 7 - y, 'yellow', 0.5);
            }
        }
        if (
            this.cursor.overSquare &&
            this.cursor.overSquare.x === x &&
            this.cursor.overSquare.y === 7 - y &&
            !this.isPromoting &&
            !(
                this.twoClickMove.source &&
                this.cursor.overSquare.x === this.twoClickMove.source.x &&
                this.cursor.overSquare.y === this.twoClickMove.source.y
            )
        ) {
            this.tintSquare(x, 7 - y, 'gray', 0.5);
            this.boardCtx.globalAlpha = 1; // reset this to full
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
            this.boardCtx.globalAlpha = 1; // reset this to full

            // TODO currently LEAVING this if block alone, but I don't think it
            // actually does anything...we already draw the pieces, investigate
            // commenting this whole block out.
            if (piece) {
                const color = piece.color;
                const pieceType = piece.type;
                const index = (color ? 6 : 0) + pieceType;
                this.boardCtx.drawImage(
                    this.pieceImages[index],
                    (this.config.orientation === Color.White ? x : 7 - x) * 80,
                    (this.config.orientation === Color.White ? 7 - y : y) * 80
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
        this.boardCtx.globalAlpha = 1;
        if (piece) {
            const color = piece.color;
            const pieceType = piece.type;
            const index = (color === 1 ? 6 : 0) + pieceType;
            if (
                this.cursor.dragging &&
                this.cursor.mouseDownOn.x === x &&
                this.cursor.mouseDownOn.y === 7 - y
                // &&
                // !this.config.restrictPieces.includes(color)
            ) {
                this.cursor.draggedPieceIndex = index;
            } else {
                this.boardCtx.drawImage(
                    this.pieceImages[index],
                    (this.config.orientation === Color.White ? x : 7 - x) * 80,
                    (this.config.orientation === Color.White ? 7 - y : y) * 80
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
        this.boardCtx.globalAlpha = globalAlpha;
        this.boardCtx.fillStyle = color;
        if (this.config.orientation === Color.Black) {
            x = 7 - x;
            y = 7 - y;
        }
        this.boardCtx.fillRect(x * 80, y * 80, 80, 80);
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
        const redTint = {
            dest: new Square(sq.file, 7 - sq.rank),
            color,
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

    get boardCtx(): any {
        return this._boardCtx;
    }
}
