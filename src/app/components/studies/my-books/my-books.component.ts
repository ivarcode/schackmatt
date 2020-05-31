import { Component } from '@angular/core';

@Component({
    selector: 'app-my-books',
    templateUrl: './my-books.component.html',
    styleUrls: ['./my-books.component.css']
})
export class MyBooksComponent {
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
