import { Component } from '@angular/core';

@Component({
    selector: 'app-board-overlay',
    templateUrl: './board-overlay.component.html',
    styleUrls: ['./board-overlay.component.css']
})
export class BoardOverlayComponent {
    private title: string;
    private displayLoadingMessage: boolean;
    constructor() {
        this.displayLoadingMessage = false;
    }

    public getDisplayLoadingMessage(): boolean {
        return this.displayLoadingMessage;
    }
}
