import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-game-details-table',
    templateUrl: './game-details-table.component.html',
    styleUrls: ['./game-details-table.component.css']
})
export class GameDetailTableComponent {
    @Input() pgn: string;

    constructor() {}

    onInit(): void {}

    change(): void {}
}
