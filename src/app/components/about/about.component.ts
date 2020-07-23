import { Component } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {
    public staffMembers: {
        name: string;
        title: string;
        bio: string;
        discord: string;
        url: string;
        goofyUrl: string;
    }[];
    constructor() {
        this.staffMembers = [
            {
                name: 'Camden Wagner',
                title: 'Head Developer',
                bio: 'chess player',
                discord: 'ivarcode',
                url: '../../../assets/Cam.png',
                goofyUrl: '../../../assets/Cam.png'
            },
            {
                name: 'Nick Groh',
                title: 'Head of Marketing',
                bio: 'chess player',
                discord: 'Ragchess',
                url: '../../../assets/Nick.png',
                goofyUrl: '../../../assets/Nick_goofy.png'
            },
            {
                name: 'Nicolas Holmgren',
                title: 'Junior Developer',
                bio: 'chess player',
                discord: 'Enrico',
                url: '../../../assets/Nick.png',
                goofyUrl: '../../../assets/Nick.png'
            }
        ];
    }
}
