import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    template: `
        <div class="topnav" id="myTopnav">
            <a routerLink="/" class="active my_font" id="title"
                >schackmatt.net</a
            >
            <a routerLink="/puzzle" class="topnavel my_font">some puzzle?</a>
            <a routerLink="/profile" class="topnavel my_font">profile</a>
        </div>
    `,
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    constructor() {}
}
