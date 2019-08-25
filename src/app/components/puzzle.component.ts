import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-puzzle',
    template: `
        <br />
        <h2>Puzzle Component</h2>
        <hr />
        <canvas #boardCanvas id="board" width="640" height="640">canvas</canvas>
    `,
    styles: ['#board { border: 1px solid #000; }']
})
export class PuzzleComponent implements OnInit {
    @ViewChild('boardCanvas', { static: true })
    boardCanvas: ElementRef<HTMLCanvasElement>;
    private boardContext: CanvasRenderingContext2D;

    private RESOURCES: {
        boardImageSrc: string;
    };

    constructor() {}

    ngOnInit() {
        this.boardContext = this.boardCanvas.nativeElement.getContext('2d');
        this.RESOURCES.boardImageSrc = '../../assets/board_640x640.png';
    }
}
