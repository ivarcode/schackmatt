import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    template: `
        <div class="topnav" id="myTopnav">
            <a routerLink="/" class="active my_font" id="title">ivarcode.net</a>
            <a routerLink="/what-i-do" class="topnavel my_font">what i do </a>
            <a routerLink="/about-me" class="topnavel my_font">about me</a>
            <a href="http://schackmatt.net/" class="topnavel my_font">chess</a>
        </div>
    `,
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    constructor() {}
}
