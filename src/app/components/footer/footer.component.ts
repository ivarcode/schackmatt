import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="container">
            <div class="text-right" style="width: 100%;">
                <div class="card-body">
                    <h5 class="card-title">implement footer (low priority)</h5>
                    <!-- <p class="card-text">
                        With supporting text below as a natural lead-in to
                        additional content.
                    </p> -->
                    <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    constructor() {}
}
