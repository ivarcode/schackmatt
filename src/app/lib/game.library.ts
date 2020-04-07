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
    // toString() {
    //     return this.content;
    // }
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

    public attemptMove(src: Square, dest: Square): boolean {
        // make the move
        this.makeMove(src, dest);
        return true;
    }

    private makeMove(src: Square, dest: Square): void {
        if (this.board.getPiece(dest)) {
            this.board.captured.push(this.board.getPiece(dest));
        }
        this.insertPiece(dest, this.board.getPiece(src));
        this.insertPiece(src, null);
    }
}
