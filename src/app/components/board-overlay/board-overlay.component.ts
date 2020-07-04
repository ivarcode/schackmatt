import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-board-overlay',
    templateUrl: './board-overlay.component.html',
    styleUrls: ['./board-overlay.component.css']
})
export class BoardOverlayComponent {
    @Input() displayLoadingMessage: boolean;
    @Input() title: string;

    constructor() {
        this.displayLoadingMessage = false;
    }

    public getDisplayLoadingMessage(): boolean {
        return this.displayLoadingMessage;
    }
    // public getTitle(): string {
    //     return this.title;
    // }
}
