export const enum PieceType {
    King,
    Queen,
    Bishop,
    Knight,
    Rook,
    Pawn
}

export const enum Color {
    White,
    Black
}

export class Piece {
    type: PieceType;
    color: Color;
    constructor(type: PieceType, color: Color) {
        this.type = type;
        this.color = color;
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
}

export const enum File {
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h
}

export const enum Rank {
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT
}

export interface Square {
    file: File;
    rank: Rank;
}

export interface Move {
    src: Square;
    dest: Square;
}

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
        return this.content[sq.file][sq.rank];
    }
    public toString(): string {
        let str = 'board:';
        for (const i of this.content) {
            str += '\n    ';
            for (const j of i) {
                str += '[' + (j ? j.toString() : ' ') + ']';
            }
        }
        return str;
    }
}

export class Game {
    private fen: string;
    private pgn: string;
    private board: Board;
    private turn: Color;
    private castlingRights: {
        K: boolean;
        Q: boolean;
        k: boolean;
        q: boolean;
    };
    private enPassant: string;
    private halfmove: number;
    private fullmove: number;

    constructor(fen?: string) {
        this.fen = fen
            ? fen
            : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        this.pgn = '';
        this.load_fen();
    }

    public toString(): string {
        let str = 'GAME\n----\n';
        str += this.board;
        str += '\nfen = ' + this.fen;
        str += '\npgn = ' + this.pgn;
        str += '\nen passant = ' + this.pgn;
        str += '\nturn = ' + this.turn;
        str += '  halfmove = ' + this.halfmove;
        str += '  fullmove = ' + this.fullmove;
        str += '\ncastling = ' + JSON.stringify(this.castlingRights);
        return str + '\n----';
    }

    // prepares the game object from the fen data
    private load_fen(): void {
        const board: Board = new Board();

        this.castlingRights = { K: false, Q: false, k: false, q: false };
        let rankIndex: Rank = Rank.EIGHT;
        let fileIndex: File = File.a;
        let spacesHit = 0;
        for (let i = 0; i < this.fen.length; i++) {
            switch (this.fen.charAt(i)) {
                case '/':
                    fileIndex = File.a;
                    rankIndex--;
                    break;
                case ' ':
                    spacesHit++;
                    break;
                default:
                    if (spacesHit > 2) {
                        let rest = this.fen.substr(i);
                        // en passant check
                        if (rest.charAt(0) === '-') {
                            this.enPassant = null;
                            rest = rest.substr(2);
                        } else {
                            this.enPassant = rest.substr(0, 2);
                            rest = rest.substr(3);
                        }
                        // halfmove
                        let halfmove = '';
                        for (let r = 0; r < rest.length; r++) {
                            if (rest[r] === ' ') {
                                rest = rest.substr(r + 1);
                                break;
                            }
                            halfmove += r;
                        }
                        this.halfmove = +halfmove;
                        // fullmove
                        this.fullmove = +rest;
                        // end initial for loop
                        i = this.fen.length;
                    } else {
                        switch (this.fen.charAt(i)) {
                            case 'r':
                                board.insertPiece(
                                    { file: fileIndex, rank: rankIndex },
                                    new Piece(PieceType.Rook, Color.Black)
                                );
                                break;
                            case 'R':
                                board.insertPiece(
                                    { file: fileIndex, rank: rankIndex },
                                    new Piece(PieceType.Rook, Color.White)
                                );
                                break;
                            case 'n':
                                board.insertPiece(
                                    { file: fileIndex, rank: rankIndex },
                                    new Piece(PieceType.Knight, Color.Black)
                                );
                                break;
                            case 'N':
                                board.insertPiece(
                                    { file: fileIndex, rank: rankIndex },
                                    new Piece(PieceType.Knight, Color.White)
                                );
                                break;
                            case 'b':
                                if (spacesHit > 0) {
                                    this.turn = Color.Black;
                                } else {
                                    board.insertPiece(
                                        { file: fileIndex, rank: rankIndex },
                                        new Piece(PieceType.Bishop, Color.Black)
                                    );
                                }
                                break;
                            case 'w':
                                this.turn = Color.White;
                                break;
                            case 'B':
                                board.insertPiece(
                                    { file: fileIndex, rank: rankIndex },
                                    new Piece(PieceType.Bishop, Color.White)
                                );
                                break;
                            case 'q':
                                if (spacesHit > 0) {
                                    this.castlingRights.q = true;
                                } else {
                                    board.insertPiece(
                                        { file: fileIndex, rank: rankIndex },
                                        new Piece(PieceType.Queen, Color.Black)
                                    );
                                }
                                break;
                            case 'Q':
                                if (spacesHit > 0) {
                                    this.castlingRights.Q = true;
                                } else {
                                    board.insertPiece(
                                        { file: fileIndex, rank: rankIndex },
                                        new Piece(PieceType.Queen, Color.White)
                                    );
                                }
                                break;
                            case 'k':
                                if (spacesHit > 0) {
                                    this.castlingRights.k = true;
                                } else {
                                    board.insertPiece(
                                        { file: fileIndex, rank: rankIndex },
                                        new Piece(PieceType.King, Color.Black)
                                    );
                                }
                                break;
                            case 'K':
                                if (spacesHit > 0) {
                                    this.castlingRights.K = true;
                                } else {
                                    board.insertPiece(
                                        { file: fileIndex, rank: rankIndex },
                                        new Piece(PieceType.King, Color.White)
                                    );
                                }
                                break;
                            case 'p':
                                board.insertPiece(
                                    { file: fileIndex, rank: rankIndex },
                                    new Piece(PieceType.Pawn, Color.Black)
                                );
                                break;
                            case 'P':
                                board.insertPiece(
                                    { file: fileIndex, rank: rankIndex },
                                    new Piece(PieceType.Pawn, Color.White)
                                );
                                break;
                        }
                    }
                    fileIndex++;
                    break;
            }
        }
        this.board = board;
    }

    public getPiece(sq: Square): Piece {
        return this.board.getPiece(sq);
    }

    private insertPiece(sq: Square, piece: Piece): void {
        this.board.insertPiece(sq, piece);
    }

    public attemptMove(move: Move): boolean {
        // make the move
        console.log('attempting ', move.src, move.dest);
        let pieceMovements = this.getPieceMovements();
        console.log('piece movements', pieceMovements);
        this.makeMove(move);
        return true;
    }

    private getPieceMovements(): Move[] {
        const movements: Move[] = [];
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const p = this.getPiece({ file: f, rank: r });
                if (p && p.color === this.turn) {
                    let pattern;
                    switch (p.type) {
                        // Knight
                        case PieceType.Knight:
                            pattern = [
                                { x: 2, y: 1 },
                                { x: 2, y: -1 },
                                { x: -2, y: 1 },
                                { x: -2, y: -1 },
                                { x: -1, y: 2 },
                                { x: -1, y: -2 },
                                { x: 1, y: 2 },
                                { x: 1, y: -2 }
                            ];
                            for (const pat of pattern) {
                                const d = {
                                    file: f + pat.x,
                                    rank: r + pat.y
                                };
                                if (this.isOnBoard(d)) {
                                    const dp = this.getPiece(d);
                                    if (!(dp && dp.color === this.turn)) {
                                        movements.push({
                                            src: {
                                                file: f,
                                                rank: r
                                            },
                                            dest: d
                                        });
                                    }
                                }
                            }
                            break;
                        // King
                        // case PieceType.Knight:
                        //     console.log(p.toString());
                        //     pattern = [
                        //         { x: 2, y: 1 },
                        //         { x: 2, y: -1 },
                        //         { x: -2, y: 1 },
                        //         { x: -2, y: -1 },
                        //         { x: -1, y: 2 },
                        //         { x: -1, y: -2 },
                        //         { x: 1, y: 2 },
                        //         { x: 1, y: -2 }
                        //     ];
                        //     for (const pat of pattern) {
                        //         const d = {
                        //             file: f + pat.x,
                        //             rank: r + pat.y
                        //         };
                        //         if (this.isOnBoard(d)) {
                        //             const dp = this.getPiece(d);
                        //             if (!(dp && dp.color === this.turn)) {
                        //                 movements.push({
                        //                     src: {
                        //                         file: f,
                        //                         rank: r
                        //                     },
                        //                     dest: d
                        //                 });
                        //             }
                        //         }
                        //     }
                        //     break;
                    }
                }
            }
        }
        return movements;
    }

    private makeMove(move: Move): void {
        if (this.board.getPiece(move.dest)) {
            this.board.captured.push(this.board.getPiece(move.dest));
        }
        this.insertPiece(move.dest, this.board.getPiece(move.src));
        this.insertPiece(move.src, null);
    }

    private isOnBoard(d: Square): boolean {
        return d.file < 8 && d.file >= 0 && d.rank < 8 && d.rank >= 0;
    }
}
