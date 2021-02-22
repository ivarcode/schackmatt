/**
 * elo.library.spec.ts
 * test file for the elo system
 */

import { Elo } from './elo.library';
import { Score } from './util.library';

/// Test results are calculated with the FIDE calculator:
/// https://ratings.fide.com/calculator_rtd.phtml

describe('Elo system', () => {
    it('should be able to calcuate the right (low-level) elo', () => {
        const playerA = new Elo(1456, 40);
        const playerB = new Elo(1790, 40);
        const result = 1491;
        playerA.update(playerB.rating, Score.win);
        expect(playerA.rating).toBe(result);
    });
    it('should be able to calcuate the right (mid-level) elo', () => {
        const playerA = new Elo(1732, 20);
        const playerB = new Elo(2047, 20);
        const result = 1739;
        playerA.update(playerB.rating, Score.draw);
        expect(playerA.rating).toBe(result);
    });
    it('should be able to calcuate the right (high-level) elo', () => {
        const playerA = new Elo(2761, 10);
        const playerB = new Elo(2622, 10);
        const result = 2754;
        playerA.update(playerB.rating, Score.loss);
        expect(playerA.rating).toBe(result);
    });
});
