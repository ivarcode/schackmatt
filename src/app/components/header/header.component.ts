import packageDetails from '../../../../package.json';
import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    public version: string = packageDetails.version;
    constructor() {}
}
