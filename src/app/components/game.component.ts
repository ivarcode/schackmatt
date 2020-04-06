import { Component, OnInit } from '@angular/core';
import { Game } from '../lib/game.library';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
    private game: Game;
    private boardCanvas: any;
    private boardContext: any;
    private boardImage: any;
    private pieceImages: any[];
    private CURSOR_DATA: {
        mouseOverBoard: boolean;
        currentMousePosition: {
            x: number;
            y: number;
        };
        overSquare: {
            x: number;
            y: number;
        };
    };

    constructor() {
        this.game = new Game();
        this.CURSOR_DATA = {
            mouseOverBoard: false,
            currentMousePosition: {
                x: -1,
                y: -1
            },
            overSquare: null
        };
        console.log(this.game);
    }

    ngOnInit() {
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

        // listeners
        this.boardCanvas.addEventListener('mouseenter', () => {
            this.CURSOR_DATA.mouseOverBoard = true;
        });
        this.boardCanvas.addEventListener('mouseleave', () => {
            this.CURSOR_DATA.mouseOverBoard = false;
            this.CURSOR_DATA.overSquare = null;
            this.drawBoard();
        });
        this.boardCanvas.addEventListener('mousemove', (events: any) => {
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
                // ooh tslint taught me shorthand
                this.CURSOR_DATA.overSquare = { x, y };
            }
            this.drawBoard();
        });
    }

    getMousePosition(events: any): { x: number; y: number } {
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

    drawBoard(): void {
        this.boardContext.restore();
        this.boardContext.globalAlpha = 1;
        // this.boardContext.fillStyle = 'yellow';
        // this.boardContext.fillRect(0, 0, 40, 40);
        this.boardContext.drawImage(this.boardImage, 0, 0);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.refreshCanvasSquare(i, j);
            }
        }
    }

    refreshCanvasSquare(x: number, y: number): void {
        const piece = this.game.getPiece(x, y);
        if (
            this.CURSOR_DATA.overSquare &&
            this.CURSOR_DATA.overSquare.x === x &&
            this.CURSOR_DATA.overSquare.y === 7 - y
        ) {
            this.tintSquare(x, 7 - y, 'yellow', 0.7);
            this.boardContext.globalAlpha = 1; // reset this to full
        }
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

    tintSquare(x: number, y: number, color: string, globalAlpha: number): void {
        this.boardContext.globalAlpha = globalAlpha;
        this.boardContext.fillStyle = color;
        this.boardContext.fillRect(x * 80, y * 80, 80, 80);
    }
}
