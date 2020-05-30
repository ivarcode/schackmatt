/**
 * game.library.spec.ts
 * test file for the game library
 * this file is responsible for ensuring all standard game rules work and
 * no edge cases fall through in the future when updating and refactoring
 * game library code
 */

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
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/5P2/PPPPPKPP/RNBQ1BNR b kq - 1 1';
                game.makeMove('Kf2');
                expect(game.getFEN()).toBe(result);
            });
        });
        describe('knight', () => {
            it('should be able to move to f3', () => {});
        });
    });
});
