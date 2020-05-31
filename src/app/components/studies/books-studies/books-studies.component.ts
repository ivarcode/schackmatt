import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector: 'app-books-studies',
    templateUrl: './books-studies.component.html',
    styleUrls: ['./books-studies.component.css']
})
export class BookStudyFormat implements OnChanges {
    @Input() fen: string;
    constructor() {}
    ngOnChanges(changes: SimpleChanges) {
        // this will fire when changes
    }
}
