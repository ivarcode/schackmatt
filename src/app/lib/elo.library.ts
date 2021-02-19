import { Score } from './util.library';

export class Elo {

	private _rating: number;
	private _K: number;
	private _games: number;

	constructor() {
		this._rating = 1200;
		this._K = 40;
		this._games = 0;
	}

	private expected(opponent: number): number {
		return 1 / (1 + Math.pow(10, (
			opponent - this._rating
		) / 400));
	}

	/// Updates the current Elo according to
	/// the opponent's Elo and the game score.
	public update(opponent: number, score: Score) {
		const E = this.expected(opponent);
		this._rating += this._K * (score - E);
		if (this._rating < 100) this._rating = 100;
		if (this._rating > 3000) this._rating = 3000;
		this._games++;
		if (this._K === 10) return;
		if (this._rating < 2400) {
			this._K = this._games < 30 ? 40 : 20;
		} else this._K = 10;
	}

	get rating(): number {
		return Math.floor(this._rating);
	}

	get games(): number {
		return this._games;
	}

}
