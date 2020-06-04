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
            it('should be able to move to 0-0', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R4RK1 b kq - 1 1';
                game.makeMove('0-0');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to 0-0-0', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/2KR3R b kq - 1 1';
                game.makeMove('0-0-0');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to e2', () => {
                game = new Game(
                    'rnbqkbnr/ppp3pp/8/3ppp2/3PPP2/8/PPP3PP/RNBQKBNR w KQkq - 0 4'
                );
                const result =
                    'rnbqkbnr/ppp3pp/8/3ppp2/3PPP2/8/PPP1K1PP/RNBQ1BNR b kq - 1 4';
                game.makeMove('Ke2');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to f2', () => {
                game = new Game(
                    'rnbqkbnr/ppp3pp/8/3ppp2/3PPP2/8/PPP3PP/RNBQKBNR w KQkq - 0 4'
                );
                const result =
                    'rnbqkbnr/ppp3pp/8/3ppp2/3PPP2/8/PPP2KPP/RNBQ1BNR b kq - 1 4';
                game.makeMove('Kf2');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to d2', () => {
                game = new Game(
                    'rnbqkbnr/ppp3pp/8/3ppp2/3PPP2/8/PPP3PP/RNBQKBNR w KQkq - 0 4'
                );
                const result =
                    'rnbqkbnr/ppp3pp/8/3ppp2/3PPP2/8/PPPK2PP/RNBQ1BNR b kq - 1 4';
                game.makeMove('Kd2');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to d3', () => {
                game = new Game(
                    'rnbqkb2/pp1ppppr/5n2/2P4p/8/4K3/PPP1PPPP/RNBQ1BNR w q - 1 5'
                );
                const result =
                    'rnbqkb2/pp1ppppr/5n2/2P4p/8/3K4/PPP1PPPP/RNBQ1BNR b q - 2 5';
                game.makeMove('Kd3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to d4', () => {
                game = new Game(
                    'rnbqkb2/pp1ppppr/5n2/2P4p/8/4K3/PPP1PPPP/RNBQ1BNR w q - 1 5'
                );
                const result =
                    'rnbqkb2/pp1ppppr/5n2/2P4p/3K4/8/PPP1PPPP/RNBQ1BNR b q - 2 5';
                game.makeMove('Kd4');
                expect(game.getFEN()).toBe(result);
            });

            it('should be able to move to f4', () => {
                game = new Game(
                    'rnbqkb2/pp1ppppr/5n2/2P4p/8/4K3/PPP1PPPP/RNBQ1BNR w q - 1 5'
                );
                const result =
                    'rnbqkb2/pp1ppppr/5n2/2P4p/5K2/8/PPP1PPPP/RNBQ1BNR b q - 2 5';
                game.makeMove('Kf4');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to f3', () => {
                game = new Game(
                    'rnbqkb2/pp1ppppr/5n2/2P4p/8/4K3/PPP1PPPP/RNBQ1BNR w q - 1 5'
                );
                const result =
                    'rnbqkb2/pp1ppppr/5n2/2P4p/8/5K2/PPP1PPPP/RNBQ1BNR b q - 2 5';
                game.makeMove('Kf3');
                expect(game.getFEN()).toBe(result);
            });

            it('should be able to move to a3', () => {
                game = new Game(
                    'rnbq2nr/pppp1pp1/5k1p/4p3/1K2P3/8/PPPP1PPP/RNBQ1BNR w - - 0 6'
                );
                const result =
                    'rnbq2nr/pppp1pp1/5k1p/4p3/4P3/K7/PPPP1PPP/RNBQ1BNR b - - 1 6';
                game.makeMove('Ka3');
                expect(game.getFEN()).toBe(result);
            });

            it('should be able to move to a4', () => {
                game = new Game(
                    'rnbq2nr/pppp1pp1/5k1p/4p3/1K2P3/8/PPPP1PPP/RNBQ1BNR w - - 0 6'
                );
                const result =
                    'rnbq2nr/pppp1pp1/5k1p/4p3/K3P3/8/PPPP1PPP/RNBQ1BNR b - - 1 6';
                game.makeMove('Ka4');
                expect(game.getFEN()).toBe(result);
            });

            it('should be able to move to a5', () => {
                game = new Game(
                    'rnbq2nr/pppp1pp1/5k1p/4p3/1K2P3/8/PPPP1PPP/RNBQ1BNR w - - 0 6'
                );
                const result =
                    'rnbq2nr/pppp1pp1/5k1p/K3p3/4P3/8/PPPP1PPP/RNBQ1BNR b - - 1 6';
                game.makeMove('Ka5');
                expect(game.getFEN()).toBe(result);
            });

            it('should be able to move to b5', () => {
                game = new Game(
                    'rnbq2nr/pppp1pp1/5k1p/4p3/1K2P3/8/PPPP1PPP/RNBQ1BNR w - - 0 6'
                );
                const result =
                    'rnbq2nr/pppp1pp1/5k1p/1K2p3/4P3/8/PPPP1PPP/RNBQ1BNR b - - 1 6';
                game.makeMove('Kb5');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to b3', () => {
                game = new Game(
                    'rnbq2nr/pppp1pp1/5k1p/4p3/1K2P3/8/PPPP1PPP/RNBQ1BNR w - - 0 6'
                );
                const result =
                    'rnbq2nr/pppp1pp1/5k1p/4p3/4P3/1K6/PPPP1PPP/RNBQ1BNR b - - 1 6';
                game.makeMove('Kb3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to c5', () => {
                game = new Game(
                    'rnbq2nr/pppp1pp1/5k1p/4p3/1K2P3/8/PPPP1PPP/RNBQ1BNR w - - 0 6'
                );
                const result =
                    'rnbq2nr/pppp1pp1/5k1p/2K1p3/4P3/8/PPPP1PPP/RNBQ1BNR b - - 1 6';
                game.makeMove('Kc5');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to c4', () => {
                game = new Game(
                    'rnbq2nr/pppp1pp1/5k1p/4p3/1K2P3/8/PPPP1PPP/RNBQ1BNR w - - 0 6'
                );
                const result =
                    'rnbq2nr/pppp1pp1/5k1p/4p3/2K1P3/8/PPPP1PPP/RNBQ1BNR b - - 1 6';
                game.makeMove('Kc4');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to c3', () => {
                game = new Game(
                    'rnbq2nr/pppp1pp1/5k1p/4p3/1K2P3/8/PPPP1PPP/RNBQ1BNR w - - 0 6'
                );
                const result =
                    'rnbq2nr/pppp1pp1/5k1p/4p3/4P3/2K5/PPPP1PPP/RNBQ1BNR b - - 1 6';
                game.makeMove('Kc3');
                expect(game.getFEN()).toBe(result);
            });
        });
        describe('knight', () => {
            it('should be able to move to f2', () => {
                game = new Game(
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/4N3/3P1P2/PPP1P1PP/RNBQKB1R w KQq - 1 6'
                );
                const result =
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/8/3P1P2/PPP1PNPP/RNBQKB1R b KQq - 2 6';
                game.makeMove('Nf2');
                expect(game.getFEN()).toBe(result);
            });

            it('should be able to move to d2', () => {
                game = new Game(
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/4N3/3P1P2/PPP1P1PP/RNBQKB1R w KQq - 1 6'
                );
                const result =
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/8/3P1P2/PPPNP1PP/RNBQKB1R b KQq - 2 6';
                game.makeMove('Ned2');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to c3', () => {
                game = new Game(
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/4N3/3P1P2/PPP1P1PP/RNBQKB1R w KQq - 1 6'
                );
                const result =
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/8/2NP1P2/PPP1P1PP/RNBQKB1R b KQq - 2 6';
                game.makeMove('Nec3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to c5', () => {
                game = new Game(
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/4N3/3P1P2/PPP1P1PP/RNBQKB1R w KQq - 1 6'
                );
                const result =
                    'rnbqkbn1/ppp2p1r/4p2p/2Np4/8/3P1P2/PPP1P1PP/RNBQKB1R b KQq - 2 6';
                game.makeMove('Nc5');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to d6', () => {
                game = new Game(
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/4N3/3P1P2/PPP1P1PP/RNBQKB1R w KQq - 1 6'
                );
                const result =
                    'rnbqkbn1/ppp2p1r/3Np2p/3p4/8/3P1P2/PPP1P1PP/RNBQKB1R b KQq - 2 6';
                game.makeMove('Nd6+');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to f6', () => {
                game = new Game(
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/4N3/3P1P2/PPP1P1PP/RNBQKB1R w KQq - 1 6'
                );
                const result =
                    'rnbqkbn1/ppp2p1r/4pN1p/3p4/8/3P1P2/PPP1P1PP/RNBQKB1R b KQq - 2 6';
                game.makeMove('Nf6+');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to g5', () => {
                game = new Game(
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/4N3/3P1P2/PPP1P1PP/RNBQKB1R w KQq - 1 6'
                );
                const result =
                    'rnbqkbn1/ppp2p1r/4p2p/3p2N1/8/3P1P2/PPP1P1PP/RNBQKB1R b KQq - 2 6';
                game.makeMove('Ng5');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to g3', () => {
                game = new Game(
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/4N3/3P1P2/PPP1P1PP/RNBQKB1R w KQq - 1 6'
                );
                const result =
                    'rnbqkbn1/ppp2p1r/4p2p/3p4/8/3P1PN1/PPP1P1PP/RNBQKB1R b KQq - 2 6';
                game.makeMove('Ng3');
                expect(game.getFEN()).toBe(result);
            });
        });
        describe('bishop', () => {
            it('should be able to move to d3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/4B3/8/PPPPPPPP/RNBQK1NR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/3B4/PPPPPPPP/RNBQK1NR b KQkq - 1 1';
                game.makeMove('Bd3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to f3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/4B3/8/PPPPPPPP/RNBQK1NR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/5B2/PPPPPPPP/RNBQK1NR b KQkq - 1 1';
                game.makeMove('Bf3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to f5', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/4B3/8/PPPPPPPP/RNBQK1NR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/5B2/8/8/PPPPPPPP/RNBQK1NR b KQkq - 1 1';
                game.makeMove('Bf5');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to g6', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/4B3/8/PPPPPPPP/RNBQK1NR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/6B1/8/8/8/PPPPPPPP/RNBQK1NR b KQkq - 1 1';
                game.makeMove('Bg6');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to xh7', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/4B3/8/PPPPPPPP/RNBQK1NR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppB/8/8/8/8/PPPPPPPP/RNBQK1NR b KQkq - 0 1';
                game.makeMove('Bxh7');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to d5', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/4B3/8/PPPPPPPP/RNBQK1NR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/3B4/8/8/PPPPPPPP/RNBQK1NR b KQkq - 1 1';
                game.makeMove('Bd5');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to c6', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/4B3/8/PPPPPPPP/RNBQK1NR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/2B5/8/8/8/PPPPPPPP/RNBQK1NR b KQkq - 1 1';
                game.makeMove('Bc6');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to xb7', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/4B3/8/PPPPPPPP/RNBQK1NR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pBpppppp/8/8/8/8/PPPPPPPP/RNBQK1NR b KQkq - 0 1';
                game.makeMove('Bxb7');
                expect(game.getFEN()).toBe(result);
            });
        });
        describe('Rook', () => {
            it('should be able to move to g4', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/6R1/PPPPPPPP/RNBQKBN1 w Qkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/6R1/8/PPPPPPPP/RNBQKBN1 b Qkq - 1 1';
                game.makeMove('Rg4');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to g5', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/6R1/PPPPPPPP/RNBQKBN1 w Qkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/6R1/8/8/PPPPPPPP/RNBQKBN1 b Qkq - 1 1';
                game.makeMove('Rg5');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to g6', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/6R1/PPPPPPPP/RNBQKBN1 w Qkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/6R1/8/8/8/PPPPPPPP/RNBQKBN1 b Qkq - 1 1';
                game.makeMove('Rg6');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to xg7', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/6R1/PPPPPPPP/RNBQKBN1 w Qkq - 0 1'
                );
                const result =
                    'rnbqkbnr/ppppppRp/8/8/8/8/PPPPPPPP/RNBQKBN1 b Qkq - 0 1';
                game.makeMove('Rxg7');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to h3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/6R1/PPPPPPPP/RNBQKBN1 w Qkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/7R/PPPPPPPP/RNBQKBN1 b Qkq - 1 1';
                game.makeMove('Rh3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to f3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/6R1/PPPPPPPP/RNBQKBN1 w Qkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/5R2/PPPPPPPP/RNBQKBN1 b Qkq - 1 1';
                game.makeMove('Rf3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to e3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/6R1/PPPPPPPP/RNBQKBN1 w Qkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/4R3/PPPPPPPP/RNBQKBN1 b Qkq - 1 1';
                game.makeMove('Re3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to d3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/6R1/PPPPPPPP/RNBQKBN1 w Qkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/3R4/PPPPPPPP/RNBQKBN1 b Qkq - 1 1';
                game.makeMove('Rd3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to c3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/6R1/PPPPPPPP/RNBQKBN1 w Qkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/2R5/PPPPPPPP/RNBQKBN1 b Qkq - 1 1';
                game.makeMove('Rc3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to b3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/6R1/PPPPPPPP/RNBQKBN1 w Qkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/1R6/PPPPPPPP/RNBQKBN1 b Qkq - 1 1';
                game.makeMove('Rb3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to a3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/6R1/PPPPPPPP/RNBQKBN1 w Qkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/R7/PPPPPPPP/RNBQKBN1 b Qkq - 1 1';
                game.makeMove('Ra3');
                expect(game.getFEN()).toBe(result);
            });
        });
        describe('Queen', () => {
            it('should be able to move to c3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/2Q5/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qc3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to b3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/1Q6/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qb3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to a3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/Q7/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qa3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to e3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/4Q3/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qe3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to f3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/5Q2/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qf3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to g3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/6Q1/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qg3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to h3', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/8/7Q/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qh3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to e4', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/4Q3/8/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qe4');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to f5', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/5Q2/8/8/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qf5');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to g6', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/6Q1/8/8/8/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qg6');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to xh7', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppQ/8/8/8/8/PPPPPPPP/RNB1KBNR b KQkq - 0 1';
                game.makeMove('Qxh7');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to d4', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/3Q4/8/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qd4');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to d5', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/3Q4/8/8/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qd5');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to d6', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/3Q4/8/8/8/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qd6');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to xd7+', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppQpppp/8/8/8/8/PPPPPPPP/RNB1KBNR b KQkq - 0 1';
                game.makeMove('Qxd7+');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to c4', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/8/2Q5/8/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qc4');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to b5', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/8/1Q6/8/8/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qb5');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to a6', () => {
                game = new Game(
                    'rnbqkbnr/pppppppp/8/8/8/3Q4/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
                );
                const result =
                    'rnbqkbnr/pppppppp/Q7/8/8/8/PPPPPPPP/RNB1KBNR b KQkq - 1 1';
                game.makeMove('Qa6');
                expect(game.getFEN()).toBe(result);
            });
        });
        describe('Pawn Push', () => {
            it('should be able to move to e3', () => {
                game = new Game('1k6/8/8/8/8/8/4P3/1K6 w - - 0 1');
                const result = '1k6/8/8/8/8/4P3/8/1K6 b - - 0 1';
                game.makeMove('e3');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to e4', () => {
                game = new Game('1k6/8/8/8/8/8/4P3/1K6 w - - 0 1');
                const result = '1k6/8/8/8/4P3/8/8/1K6 b - - 0 1';
                game.makeMove('e4');
                expect(game.getFEN()).toBe(result);
            });
        });
        describe('Pawn capture', () => {
            it('should be able to move to exf4', () => {
                game = new Game('1k6/1p6/8/2P5/5p2/4P3/1K6/8 w - - 0 1');
                const result = '1k6/1p6/8/2P5/5P2/8/1K6/8 b - - 0 1';
                game.makeMove('exf4');
                expect(game.getFEN()).toBe(result);
            });
        });
        describe('Pawn capture with promotion', () => {
            it('should be able to move to exf8 and promote to queen', () => {
                game = new Game('5p2/1k2P3/8/8/8/8/2K5/8 w - - 0 1');
                const result = '5Q2/1k6/8/8/8/8/2K5/8 b - - 0 1';
                game.makeMove('exf8=Q');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to exf8 and promote to rook', () => {
                game = new Game('5p2/1k2P3/8/8/8/8/2K5/8 w - - 0 1');
                const result = '5R2/1k6/8/8/8/8/2K5/8 b - - 0 1';
                game.makeMove('exf8=R');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to exf8 and promote to knight', () => {
                game = new Game('5p2/1k2P3/8/8/8/8/2K5/8 w - - 0 1');
                const result = '5N2/1k6/8/8/8/8/2K5/8 b - - 0 1';
                game.makeMove('exf8=N');
                expect(game.getFEN()).toBe(result);
            });
            it('should be able to move to exf8 and promote to bishop', () => {
                game = new Game('5p2/1k2P3/8/8/8/8/2K5/8 w - - 0 1');
                const result = '5B2/1k6/8/8/8/8/2K5/8 b - - 0 1';
                game.makeMove('exf8=B');
                expect(game.getFEN()).toBe(result);
            });
        });
        describe('Pawn En Passant', () => {
            it('should be able to move to exf5', () => {
                game = new Game('8/8/8/4Pp2/2K5/k7/8/8 w - f6 0 2');
                const result = '8/8/5P2/8/2K5/k7/8/8 b - - 0 2';
                game.makeMove('exf6');
                expect(game.getFEN()).toBe(result);
            });
        });
    });
});
