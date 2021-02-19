import { Score } from './util.library';

export class Elo {

	private _rating: number;
	private _K: number;
	private _games: number;

	constructor(rating?: number, k?: number) {
		this._rating = rating ?? 1500;
		this._K = k ?? 40;
		if (this._K !== 10 &&
			this._K !== 20 &&
			this._K !== 40) this._K = 40;
		this._games = this._K === 40 ? 0 : 30;
	}

	private expected(opponent: number): number {
		let p = opponent - this._rating;
		if (Math.abs(p) > 400) p = p < 0 ? - 400 : 400;
		return 1 / (1 + Math.pow(10, p / 400));
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
		return Math.round(this._rating);
	}

	get games(): number {
		return this._games;
	}

}
