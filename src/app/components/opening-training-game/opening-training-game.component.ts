import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/lib/game.library';
import { Study } from 'src/app/lib/study.library';
import { GameEvent } from 'src/app/lib/interface.library';

@Component({
    selector: 'app-opening-training-game',
    templateUrl: './opening-training-game.component.html',
    styleUrls: ['./opening-training-game.component.css']
})
export class OpeningTrainingGameComponent implements OnInit {
    private game: Game;
    private opening: Study;
    private gameInterfaceCommand: string;
    private alertType: string;
    private choiceHeadingMessage: string;
    private choiceQuote: string;
    private choiceAuthor: string;

    constructor() {
        this.game = new Game();
    }
    ngOnInit() {
        this.opening = new Study(
            // '1. e4 e5 2. Nf3 Nc6 3. c3 Nf6 (3... d5 4. Qa4) 4. d4 *'
            // '1. e4 d5 2. exd5 Qxd5 3. Nc3 { test comment } 3... Qd8 4. Nf3 Bg4 5. d4 (5. Bc4 Qxd2+ 6. Bxd2 Nc6 (6... Bxf3 7. Qxf3 e5 8. O-O-O Bb4) 7. O-O O-O-O) *'
            // '1. e4 d5 (1... e5)  (1... f5)  (1... c5)  (1... b5) *'
            // '1. e4 { bop } d5 { d5c } (1... e5 { e5c }) 2. exd5 c6 3. dxc6 { herp } (3. Nf3 { derp }) *'
            // '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bb6 5. a4 a6 (5... a5 6. b5 Nd4 7. Nxd4 Bxd4 8. c3 Bb6 9. d4 Qh4 (9... exd4 10. O-O Ne7 11. Bg5 h6 12. Bxe7 Qxe7 13. cxd4 Qd6 14. Nc3 Bxd4 15. Nd5 Bxa1 16. Qxa1 f6 17. b6 cxb6 18. e5 fxe5 19. Re1 Kd8 20. Rxe5 b5 21. Bxb5 b6 22. Ne3 Bb7)  (9... Qe7 10. O-O Nf6 11. Nd2 d6 12. Nf3 (12. Bb2 Be6 13. Bd3 O-O 14. h3 h6 15. d5 Bc8 16. Nc4 Nd7 17. Qh5 Bc5) 12... Bg4 13. Be3 Nd7 14. Bd5 Rb8 15. Qd3 Qf6 16. Rad1 Bxf3 17. gxf3 O-O 18. Kh1 exd4 19. Bxd4) 10. O-O Nf6 11. Nd2 d6 12. Nf3 Qh5 13. dxe5 dxe5 14. Ba3 Bd7 15. Qb3 Bg4 16. Rfd1 Rf8 17. Ra2 Nxe4 18. Rd3 Nd6 19. Bd5 e4 20. Bxe4 O-O-O 21. Bxd6 Rfe8 22. Qc4 Bxf3 23. Rxf3 Rxd6 24. g3 Rde6 25. Qd5) 6. Nc3 Nf6 (6... d6 7. Nd5 Ba7 8. d3 h6 9. c3 Nf6 10. O-O O-O 11. Be3 Nxd5 12. Bxd5 Ne7 13. Ba2 Ng6) 7. Nd5 d6 (7... Nxd5 8. exd5 Nd4 9. a5 Ba7 10. d6 Nf5) 8. Nxb6 cxb6 9. d3 O-O 10. c3 d5 11. exd5 Nxd5 12. Qb3 Nf4 13. Bxf4 exf4 14. h3 (14. O-O Bg4 15. Nd2 Be2 16. Rfe1 Bxd3 17. Bxd3 Qxd3 18. Rad1 Rfe8 19. Rxe8+ Rxe8 20. Nf3 Qf5 21. h3 h6) 14... Qe7+ 15. Kd2 Bd7 16. Rhe1 *'
            '1. e4 e5 2. Nf3 Nc6'
            // '1. e4 e5 2. d4 d5'
        );
        this.alertType = 'alert-warning';
        this.choiceHeadingMessage = 'no message';
        this.choiceAuthor = '';
        this.choiceQuote = '';
    }
    public navigationDataEvent(event: string): void {
        console.log('nav emit', event);
        if (event === 'forward' || event === 'back') {
            this.triggerGameInterfaceCommand(event);
        }
    }
    public gameDataEvent(event: GameEvent): void {
        console.log('game emit', event);
        if (event.type === 'move') {
            this.quoteSelector();
            if (!this.opening.traverseIndex(event.content)) {
                // throw Error('your move was not very good');
                this.showFailureNotification();
                setTimeout(() => {
                    this.game.undoLastMove();
                    this.triggerGameInterfaceCommand('displayMoveIndex--');
                }, 1000);
            } else {
                this.showSuccessNotification();
                // 1 second timeout
                setTimeout(() => {
                    const randMove = this.opening.selectAndTraverseRandomMove();
                    if (randMove !== null) {
                        this.game.makeMove(randMove);
                    }
                    this.triggerGameInterfaceCommand('redraw board');
                }, 1000);
            }
        }
    }
    private triggerGameInterfaceCommand(command: string): void {
        this.gameInterfaceCommand = command;
        // using setTimeout because it appears that a slight delay before reset
        // helps to trigger change detection smoothly (research required?)
        setTimeout(() => {
            this.gameInterfaceCommand = null;
        }, 10);
    }

    private showSuccessNotification(): void {
        this.alertType = 'alert-success';
        this.choiceHeadingMessage = 'Well done!';
    }

    private showFailureNotification(): void {
        this.alertType = 'alert-danger';
        this.choiceHeadingMessage = 'Wrong Move!';
    }

    private quoteSelector(): void {
        let quote = {
            str:
                '"You must take your opponent into a deep dark forest where ' +
                '2+2=5, and the path leading out is only wide ' +
                'enough for one."',
            by: 'Mikhail Tal'
        };
        this.choiceQuote = quote.str;
        this.choiceAuthor = quote.by;
    }

    public getGame(): Game {
        return this.game;
    }
    public getGameInterfaceCommand(): string {
        return this.gameInterfaceCommand;
    }
    public getAlertType(): string {
        return this.alertType;
    }
    public getChoiceHeadingMessage(): string {
        return this.choiceHeadingMessage;
    }
    public getChoiceQuote(): string {
        return this.choiceQuote;
    }
    public getChoiceAuthor(): string {
        return this.choiceAuthor;
    }
}
