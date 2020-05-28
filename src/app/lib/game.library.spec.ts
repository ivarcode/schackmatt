import { Game } from './game.library';
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

    describe(':: outer', () => {
        describe(':: inner', () => {
            it('should do a thing', () => {
                expect(true).toBe(true);
            });
        });
    });
});
