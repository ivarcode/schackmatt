import { Component } from '@angular/core';

@Component({
    selector: 'app-my-studies',
    templateUrl: './my-studies.component.html',
    styleUrls: ['./my-studies.component.css']
})
export class MyStudiesComponent {
    private fen: string;
    inputValue: string = '';
    constructor() {}
    public fenSubmit(): void {
        this.fen = this.inputValue;
    }
    public getFEN(): string {
        return this.fen;
    }
}
