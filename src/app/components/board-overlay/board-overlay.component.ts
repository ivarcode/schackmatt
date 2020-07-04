import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-board-overlay',
    templateUrl: './board-overlay.component.html',
    styleUrls: ['./board-overlay.component.css']
})
export class BoardOverlayComponent {
    @Input() boardOverlayData: {
        title: string;
        displayLoadingMessage: boolean;
        detailedMessage: string;
    };

    constructor() {}
}
