import { Component } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {
    public carouselItems: {
        title: string;
        details: string;
    }[];
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
        ];
        this.carouselItems = [
            {
                title: 'Our Mission',
                details:
                    'The goal of Chess Trainer Hub is to help players improve their chess skills through pattern recognition, repetition and challenging puzzles. Using an interactive chess board and detailed guides, players of all levels are able to learn and develop better techniques.'
            },
            {
                title: 'How It Works',
                details:
                    'Chess Trainer Hub is built around lessons and practice scenarios. Players will be able to learn the concepts and material and then proceed to play those scenarios out in the interface. Various modes of tactical, positional, and theory-based training tools are what we strive to bring to you!'
            },
            {
                title: 'Feedback',
                details:
                    'Our site is in a state of continuous optimization. We’re always looking for feedback from users. Are there specific lessons you’d like to see covered? Is there a specific feature you’d like to see added? Is there a bug that is interfering with your ability tocomplete a lesson or puzzle? Email us, we appreciate your help!'
            },
            {
                title: 'Contact Us',
                details:
                    'Our head developer is doing his best to triage new tasks and welcomes new collaborators! Use the links below to join our Discord, find us on lichess, connect any way you want...'
            }
        ];
    }
}
