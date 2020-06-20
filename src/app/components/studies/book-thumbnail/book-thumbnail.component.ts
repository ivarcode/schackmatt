import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector: 'app-book-thumbnail',
    templateUrl: './book-thumbnail.component.html',
    styleUrls: ['./book-thumbnail.component.css']
})
export class BookThumbnailComponent implements OnChanges {
    @Input() fen: string;
    constructor() {}
    ngOnChanges(changes: SimpleChanges) {
        // this will fire when changes
    }
}
