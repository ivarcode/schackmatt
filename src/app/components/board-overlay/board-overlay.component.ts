import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-board-overlay',
    templateUrl: './board-overlay.component.html',
    styleUrls: ['./board-overlay.component.css']
})
export class BoardOverlayComponent {
    @Output() boardOverlayEmitter = new EventEmitter<string>();
    @Input() boardOverlayData: {
        title: string;
        displayLoadingMessage: boolean;
        detailedMessage: string;
        displayButtons: boolean;
    };

    constructor() {}

    public emit(event: string): void {
        this.boardOverlayEmitter.emit(event);
    }
}
