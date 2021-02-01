import { Color, PieceType } from './util.library';

export class Piece {
    private _type: PieceType;
    private _color: Color;
    constructor(type: PieceType, color: Color) {
        this._type = type;
        this._color = color;
    }
    public toString(): string {
        let str = null;
        switch (this.type) {
            case PieceType.King:
                str = 'k';
                break;
            case PieceType.Queen:
                str = 'q';
                break;
            case PieceType.Bishop:
                str = 'b';
                break;
            case PieceType.Knight:
                str = 'n';
                break;
            case PieceType.Rook:
                str = 'r';
                break;
            case PieceType.Pawn:
                str = 'p';
                break;
        }
        if (this.color === Color.White) {
            return str.toUpperCase();
        }
        return str;
    }

    get color(): Color {
        return this._color;
    }
    get type(): PieceType {
        return this._type;
    }
}
