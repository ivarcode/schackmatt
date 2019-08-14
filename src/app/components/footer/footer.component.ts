import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="botnav" id="myBotNav">
            <a
                class="my_font"
                target="_blank"
                href="https://www.ivarcode.net/aboutme"
                >C.I.W.</a
            >
        </div>
    `,
    styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    constructor() {}
}
