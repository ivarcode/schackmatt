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
        lichess: string;
        discord: string;
        discordLink: string;
        url: string;
    }[];
    constructor() {
        this.staffMembers = [
            {
                name: 'Camden Wagner',
                title: 'Head Developer, Content Creator',
                bio:
                    'Cam learned to play chess in 2002 and has taught, trained, and competed regularly for the last several years.  He also streams on twitch and enjoys collaborating with other chess and software enthusiasts.',
                lichess: 'ivarcode',
                discord: 'ivarcode',
                discordLink: 'https://discord.gg/sMNA9UGGbG',
                url: '../../../assets/Cam.png'
            },
            {
                name: 'Nick Groh',
                title: 'Head of Marketing, Coach, Content Creator',
                bio:
                    'Nick has been playing chess over 20 years and loves sharing his passion for the game.  He writes about chess improvement on his blog ragchess.com, which receives over 50,000 unique users per month.',
                lichess: 'ragnarok5375',
                discord: 'Ragchess',
                discordLink: 'https://discord.gg/msr7NuZW',
                url: '../../../assets/Nick.png'
            }
            // {
            //     name: 'Nicolas Holmgren',
            //     title: 'Junior Developer',
            //     bio: 'chess player',
            //     discord: 'Enrico',
            //     url: '../../../assets/Nick.png',
            //     goofyUrl: '../../../assets/Nick.png'
            // }
        ];
    }
}
