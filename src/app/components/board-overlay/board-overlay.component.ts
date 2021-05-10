import {
    Component,
    Input,
    EventEmitter,
    Output,
    ViewChild,
    ElementRef,
    OnInit
} from '@angular/core';

@Component({
    selector: 'app-board-overlay',
    templateUrl: './board-overlay.component.html',
    styleUrls: ['./board-overlay.component.css']
})
export class BoardOverlayComponent implements OnInit {
    @ViewChild('container') private _container: ElementRef;
    @Output() boardOverlayEmitter = new EventEmitter<string>();
    // boardOverlayConfig, probably a better name
    @Input() boardOverlayData: {
        title: string;
        displayLoadingMessage: boolean;
        detailedMessage: string;
        displayButtons: string[];
        maxWidth: number;
    };

    public overlayWidthAndHeight: number;

    constructor() {
        this.overlayWidthAndHeight = 1;
    }

    public emit(event: string): void {
        this.boardOverlayEmitter.emit(event);
    }

    ngOnInit() {
        setTimeout(() => {
            this.resizeBoardOverlay(null);
        });
    }

    public resizeBoardOverlay(event: any) {
        // console.log('event', event);
        const currentContainerWidth = this._container.nativeElement.offsetWidth;
        // default margin on edges of board is 15px * 2 = 30
        const marginDiff = 30;
        let newSize = Math.floor(currentContainerWidth - marginDiff);
        if (newSize > this.boardOverlayData.maxWidth) {
            newSize = this.boardOverlayData.maxWidth;
        }
        if (this.overlayWidthAndHeight !== newSize) {
            this.overlayWidthAndHeight = newSize;
            // console.log('size adjusted to: ', this.overlayWidthAndHeight);
        }
    }

    get overlayWidthAndHeightPx(): string {
        return this.overlayWidthAndHeight + 'px';
    }
}
