import { Piece } from './piece.libary';
import { Square } from './square.library';
import { RANK, FILE } from './util.library';

export class Board {
    private content: Piece[][];
    public captured: Piece[];
    constructor() {
        this.content = [[], [], [], [], [], [], [], []];
        this.captured = [];
    }
    public insertPiece(sq: Square, piece: Piece): void {
        this.content[sq.file][sq.rank] = piece;
    }
    public getPiece(sq: Square): Piece {
        const p = this.content[sq.file][sq.rank];
        return p;
    }
    public findPiece(piece: Piece): Square[] {
        const sqArray: Square[] = [];
        for (let rank = RANK.ONE; rank <= RANK.EIGHT; rank++) {
            for (let file = FILE.a; file <= FILE.h; file++) {
                const sq = new Square(file, rank);
                const p = this.getPiece(sq);
                if (p && p.color === piece.color && p.type === piece.type) {
                    sqArray.push(sq);
                }
            }
        }
        return sqArray;
    }
    public toString(): string {
        let str = 'board:';
        for (const i of this.content) {
            str += '\n    ';
            for (let j = 0; j < 8; j++) {
                const a = i[j];
                str += '[' + (a ? a.toString() : ' ') + ']';
            }
        }
        return str;
    }
}
