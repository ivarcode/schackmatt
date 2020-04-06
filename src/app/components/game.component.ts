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

    constructor() {
        this.game = new Game();

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
    }

    drawBoard(): void {
        this.boardContext.restore();
        this.boardContext.globalAlpha = 1;
        // this.boardContext.fillStyle = 'yellow';
        // this.boardContext.fillRect(0, 0, 40, 40);
        this.boardContext.drawImage(this.boardImage, 0, 0);
    }

    refreshCanvasSquare(x: number, y: number): void {}
}
