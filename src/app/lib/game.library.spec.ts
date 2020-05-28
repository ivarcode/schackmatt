import { Game, File, Rank } from './game.library';
import { TestBed, async } from '@angular/core/testing';

describe('Game', () => {
    let game: Game;

    beforeEach(async(() => {
        // like if we wanted to test services?
        // TestBed.configureTestingModule({
        //     declarations: [],
        //     imports: [BrowserModule],
        //     providers: [Service]
        // });
        // service = TestBed.get(Service);
    }));

    // ================================================

    describe('piece movement', () => {
        describe('king', () => {
            it('should be able to move to f2', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 1'
                );
                const legalMoves = game.getLegalMoves();
                // for (let m = 0; m < legalMoves.length; m++) {
                //     if (
                //         legalMoves[m].dest.file === File.f &&
                //         legalMoves[m].dest.rank === Rank.TWO
                //     ) {
                //         // console.log(m);
                //     }
                // }
                // console.log(legalMoves);
                const result = game.getNextFENFromMove(legalMoves[2]);
                game.attemptMove(legalMoves[2]);
                // console.log('getFEN', game.getFEN());
                // console.log('result', result);
                expect(game.getFEN()).toBe(result);
            });
        });
        describe('knight', () => {
            it('should be able to move to f3', () => {
                game = new Game(
                    'rnb1kb1r/pppppppp/8/6qr/6n1/6K1/4q3/7N w kq - 0 1'
                );
                const legalMoves = game.getLegalMoves();
                // for (let m = 0; m < legalMoves.length; m++) {
                //     if (
                //         legalMoves[m].dest.file === File.f &&
                //         legalMoves[m].dest.rank === Rank.TWO
                //     ) {
                //         // console.log(m);
                //     }
                // }
                // console.log(legalMoves);
                const result = game.getNextFENFromMove(legalMoves[0]);
                game.attemptMove(legalMoves[0]);
                // console.log('getFEN', game.getFEN());
                // console.log('result', result);
                expect(game.getFEN()).toBe(result);
            });
        });
    });
});
