import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
    ViewChild,
    ElementRef
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
export class GameComponent implements OnInit {
    @ViewChild('gameContainer') private _gameContainer: ElementRef;
    @Output() gameDataEmitter = new EventEmitter<GameEvent>();
    @Input() game: Game;
    @Input() config: GameConfig;

    private _displayedMoveIndex: number;
    private _squareSize: number;
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
    private drawnArrowsAndCircles: {
        src: Square;
        dest: Square;
        color: string;
        lineWidth: number;
    }[];
    private isPromoting: boolean;
    private matchingMoves: any[];
    private _initPosition: Board;

    // event listener functions
    private _mouseEnterEventListener: (event: any) => void;
    private _mouseLeaveEventListener: () => void;
    private _mouseMoveEventListener: (event: any) => void;
    private _mouseDownEventListener: (event: any) => void;
    private _mouseUpEventListener: (event: any) => void;

    constructor() {
        // this.game = new Game('1k6/1p6/8/2P5/5p2/4P3/1K6/8 w - - 0 1');
        this._squareSize = 1;
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
        this.drawnArrowsAndCircles = [];
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

                // clear arrows and circles
                this.drawnArrowsAndCircles = [];
                this.drawBoard();

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
                if (this.cursor.overSquare) {
                    this.cursor.mouseDownOn = this.cursor.overSquare;
                }
                // logic for right mouse pressed DOWN event here
                this.cursor.draggedPieceIndex = -1;
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
                this.cursor.mouseUpOn = this.cursor.overSquare;
                // create new circle or arrow
                const src =
                    this.config.orientation === Color.White
                        ? new Square(
                              this.cursor.mouseDownOn.x,
                              this.cursor.mouseDownOn.y
                          )
                        : new Square(
                              7 - this.cursor.mouseDownOn.x,
                              7 - this.cursor.mouseDownOn.y
                          );
                const dest =
                    this.config.orientation === Color.White
                        ? new Square(
                              this.cursor.mouseUpOn.x,
                              this.cursor.mouseUpOn.y
                          )
                        : new Square(
                              7 - this.cursor.mouseUpOn.x,
                              7 - this.cursor.mouseUpOn.y
                          );
                const newArrowOrCircle = {
                    src,
                    dest,
                    color: '#15781B',
                    lineWidth: 10
                };
                // find index of a arrow that matches, that may or may not
                // already exist
                const index = this.drawnArrowsAndCircles.findIndex(
                    (arrow) =>
                        arrow.src.toString() ===
                            newArrowOrCircle.src.toString() &&
                        arrow.dest.toString() ===
                            newArrowOrCircle.dest.toString()
                );
                let unique = true;
                // delete if arrow already exists, else add a new arrow
                if (index !== -1) {
                    this.drawnArrowsAndCircles.splice(index, 1);
                    unique = false;
                }
                if (unique) {
                    this.drawnArrowsAndCircles.push(newArrowOrCircle);
                }
                this.drawBoard();
                // }
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
        // probably don't need a board image anymore? TODO
        this.boardImage = new Image();
        this.boardImage.src = '../../assets/board_640x640.png';
        // because apparently I have to wait on the image smh
        this.boardImage.onload = () => {
            this.drawBoard();
        };
        // doing this inside a timeout allows the DOM to exist :D
        setTimeout(() => {
            // resize the board once
            this.resizeBoard(null);
        });
        // create all the board event listeners
        this.initializeEventListeners();
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

    public resizeBoard(event: any) {
        // console.log('event', event);
        const currentGameContainerWidth = this._gameContainer.nativeElement
            .offsetWidth;
        // default margin on edges of board is 20px
        const marginDiff = 40;
        let newSize = Math.floor((currentGameContainerWidth - marginDiff) / 8);
        if (newSize > this.config.maxSquareDimensions) {
            newSize = this.config.maxSquareDimensions;
        }
        if (this.squareSize !== newSize) {
            this.squareSize = newSize;
            console.log('square size adjusted to: ', this.squareSize);
        }
        // doing this inside a setTimeout call allows the variables to populate
        setTimeout(() => {
            this.drawBoard();
        });
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
        if (e.offsetX > this.boardSize - 1) {
            e.offsetX = this.boardSize - 1;
        }
        if (e.offsetY > this.boardSize - 1) {
            e.offsetY = this.boardSize - 1;
        }

        if (this.config.orientation === Color.Black) {
            e.offsetX = this.boardSize - e.offsetX;
            e.offsetY = this.boardSize - e.offsetY;
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
            x -= x % this.squareSize;
            y -= y % this.squareSize;
            x /= this.squareSize;
            y /= this.squareSize;
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
            this.drawBoard();
            if (this.cursor.rightMouseIsDown) {
                // console.log(
                //     'draw circle or sq at ',
                //     this.cursor.mouseDownOn,
                //     this.cursor.overSquare
                // );
                const src =
                    this.config.orientation === Color.White
                        ? new Square(
                              this.cursor.mouseDownOn.x,
                              this.cursor.mouseDownOn.y
                          )
                        : new Square(
                              7 - this.cursor.mouseDownOn.x,
                              7 - this.cursor.mouseDownOn.y
                          );
                const dest =
                    this.config.orientation === Color.White
                        ? new Square(
                              this.cursor.overSquare.x,
                              this.cursor.overSquare.y
                          )
                        : new Square(
                              7 - this.cursor.overSquare.x,
                              7 - this.cursor.overSquare.y
                          );
                const tempArrowOrCircle = {
                    src,
                    dest,
                    color: '#15781B',
                    lineWidth: 12
                };
                if (
                    this.cursor.mouseDownOn.x === this.cursor.overSquare.x &&
                    this.cursor.mouseDownOn.y === this.cursor.overSquare.y
                ) {
                    this.drawCircle(tempArrowOrCircle);
                } else {
                    this.drawArrow(tempArrowOrCircle);
                }
            }
        }
    }

    public setDisplayedMoveIndex(index: number): void {
        this.displayedMoveIndex = index;
    }
    public getDisplayedMoveIndex(): number {
        return this.displayedMoveIndex;
    }
    //

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

    /**
     * @description triggers a redraw event of the entire board
     */
    public drawBoard(): void {
        this.boardCtx.restore();
        this.boardCtx.globalAlpha = 1;
        this.boardCtx.font = '15px Arial';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // no need to invert this if config.orientation is black
                this.boardCtx.fillStyle =
                    (i + j) % 2 === 0
                        ? this.config.colorScheme.light
                        : this.config.colorScheme.dark;
                this.boardCtx.fillRect(
                    i * this.squareSize,
                    j * this.squareSize,
                    this.squareSize,
                    this.squareSize
                );
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

        this.drawArrowsAndCircles();

        this.boardCtx.globalAlpha = 1;
        if (
            this.cursor.draggedPieceIndex !== -1 &&
            this.cursor.mouseOverBoard
        ) {
            let x = this.cursor.currentMousePosition.x;
            let y = this.cursor.currentMousePosition.y;
            if (this.config.orientation === Color.Black) {
                x = this.boardSize - 1 - x;
                y = this.boardSize - 1 - y;
            }
            this.boardCtx.drawImage(
                this.pieceImages[this.cursor.draggedPieceIndex],
                x - this.squareSize / 2,
                y - this.squareSize / 2,
                this.squareSize,
                this.squareSize
            );
        }
        if (this.isPromoting) {
            this.boardCtx.globalAlpha = 0.5;
            this.boardCtx.fillStyle = 'black';
            this.boardCtx.fillRect(0, 0, this.boardSize, this.boardSize);
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
                x * this.squareSize,
                drawAtTopOfBoard ? 0 : this.squareSize * 4,
                this.squareSize,
                this.squareSize * 4
            );
            const _4ys = drawAtTopOfBoard
                ? [0, this.squareSize, this.squareSize * 2, this.squareSize * 3]
                : [
                      this.squareSize * 7,
                      this.squareSize * 6,
                      this.squareSize * 5,
                      this.squareSize * 4
                  ];
            if (this.game.turn === Color.White) {
                this.boardCtx.drawImage(
                    this.pieceImages[1],
                    x * this.squareSize,
                    _4ys[0],
                    this.squareSize,
                    this.squareSize
                );
                this.boardCtx.drawImage(
                    this.pieceImages[3],
                    x * this.squareSize,
                    _4ys[1],
                    this.squareSize,
                    this.squareSize
                );
                this.boardCtx.drawImage(
                    this.pieceImages[4],
                    x * this.squareSize,
                    _4ys[2],
                    this.squareSize,
                    this.squareSize
                );
                this.boardCtx.drawImage(
                    this.pieceImages[2],
                    x * this.squareSize,
                    _4ys[3],
                    this.squareSize,
                    this.squareSize
                );
            } else {
                this.boardCtx.drawImage(
                    this.pieceImages[7],
                    x * this.squareSize,
                    _4ys[0],
                    this.squareSize,
                    this.squareSize
                );
                this.boardCtx.drawImage(
                    this.pieceImages[9],
                    x * this.squareSize,
                    _4ys[1],
                    this.squareSize,
                    this.squareSize
                );
                this.boardCtx.drawImage(
                    this.pieceImages[10],
                    x * this.squareSize,
                    _4ys[2],
                    this.squareSize,
                    this.squareSize
                );
                this.boardCtx.drawImage(
                    this.pieceImages[8],
                    x * this.squareSize,
                    _4ys[3],
                    this.squareSize,
                    this.squareSize
                );
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
                        this.boardSize - 12,
                        j * this.squareSize + 15
                    );
                }
                if (j === 7) {
                    // bottom row
                    this.boardCtx.fillText(
                        fileToString(
                            this.config.orientation === Color.White ? i : 7 - i
                        ),
                        i * this.squareSize + 5,
                        this.boardSize - 5
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
                    (this.config.orientation === Color.White ? x : 7 - x) *
                        this.squareSize,
                    (this.config.orientation === Color.White ? 7 - y : y) *
                        this.squareSize,
                    this.squareSize,
                    this.squareSize
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
                    (this.config.orientation === Color.White ? x : 7 - x) *
                        this.squareSize,
                    (this.config.orientation === Color.White ? 7 - y : y) *
                        this.squareSize,
                    this.squareSize,
                    this.squareSize
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
        this.boardCtx.fillRect(
            x * this.squareSize,
            y * this.squareSize,
            this.squareSize,
            this.squareSize
        );
    }

    public getGame(): Game {
        return this.game;
    }

    set initPosition(board: Board) {
        this._initPosition = board;
    }
    get initPosition(): Board {
        return this._initPosition;
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

    get displayedMoveIndex(): number {
        return this._displayedMoveIndex;
    }
    set displayedMoveIndex(i: number) {
        this._displayedMoveIndex = i;
    }
    get boardCtx(): any {
        return this._boardCtx;
    }

    private drawArrowsAndCircles(): void {
        this.boardCtx.globalAlpha = 0.5;
        for (const ac of this.drawnArrowsAndCircles) {
            if (ac.src.file === ac.dest.file && ac.src.rank === ac.dest.rank) {
                // draw circle
                this.drawCircle(ac);
            } else {
                // draw arrow
                this.drawArrow(ac);
            }
        }
    }

    private drawCircle(circle: {
        src: Square;
        dest: Square;
        color: string;
        lineWidth: number;
    }): void {
        // line not completely necessary
        // this.boardCtx.globalAlpha = 0.5;
        const x = circle.src.file * this.squareSize + this.squareSize / 2;
        const y = circle.src.rank * this.squareSize + this.squareSize / 2;
        const color = circle.color;
        const lineWidth = circle.lineWidth;

        // save the state of the canvas first then perform transformation
        this.boardCtx.save();
        this.boardCtx.translate(x, y);

        // draws the circle
        this.boardCtx.beginPath();
        this.boardCtx.arc(0, 0, 37.5, 0, 2 * Math.PI);
        this.boardCtx.lineWidth = lineWidth;
        this.boardCtx.strokeStyle = color;
        this.boardCtx.stroke();

        // finally restore the state of the canvas
        this.boardCtx.restore();
    }

    private drawArrow(arrow: {
        src: Square;
        dest: Square;
        color: string;
        lineWidth: number;
    }): void {
        // setup values
        const fromX = arrow.src.file * this.squareSize + this.squareSize / 2;
        const fromY = arrow.src.rank * this.squareSize + this.squareSize / 2;
        const toX = arrow.dest.file * this.squareSize + this.squareSize / 2;
        const toY = arrow.dest.rank * this.squareSize + this.squareSize / 2;
        const color = arrow.color;
        // pointer displacement from the center
        const displacement = -5;
        // radius of the circumcircle of the triangle pointer
        const r = 25;
        const lineWidth = arrow.lineWidth;
        // imaginary triangle - hypotenuse goes from origin sq to dest sq
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const hypotenuse =
            Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2) + displacement;

        // save the state of the canvas first then perform transformations
        this.boardCtx.save();
        this.boardCtx.translate(fromX, fromY);
        this.boardCtx.rotate(angle);

        // draws the line
        this.boardCtx.beginPath();
        this.boardCtx.moveTo(0, 0);
        this.boardCtx.lineTo(hypotenuse - r, 0);
        this.boardCtx.lineWidth = lineWidth;
        this.boardCtx.strokeStyle = color;
        this.boardCtx.stroke();

        // draws the triangle pointer
        this.boardCtx.beginPath();
        this.boardCtx.lineTo(hypotenuse - r, r);
        this.boardCtx.lineTo(hypotenuse, 0);
        this.boardCtx.lineTo(hypotenuse - r, -r);
        this.boardCtx.fillStyle = color;
        this.boardCtx.fill();
        this.boardCtx.translate(0, 0);

        // finally restore the state of the canvas
        this.boardCtx.restore();
    }

    set squareSize(s: number) {
        this._squareSize = s;
    }
    get squareSize(): number {
        return this._squareSize;
    }
    get boardSize(): number {
        return this.squareSize * 8;
    }
}
