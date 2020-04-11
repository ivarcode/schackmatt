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
    resultingBoard: Board;
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

    // pull this out as well as other helpers at some point
    public squareToString(sq: Square): string {
        return String.fromCharCode(97 + sq.file) + (sq.rank + 1);
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
        if (this.getPiece(sq) !== null) {
            this.board.captured.push(this.getPiece(sq));
        }
        this.board.insertPiece(sq, piece);
    }

    public attemptMove(move: Move): boolean {
        // make the move
        console.log('attempting ', move.src, move.dest);
        let pieceMovements = this.getPieceMovements();
        console.log('pm', pieceMovements);
        // for (const pm of pieceMovements) {
        //     console.log('pm', pm.resultingBoard.toString());
        // }
        this.makeMove(move);
        return true;
    }

    public isThreatenedBy(sq: Square, color: Color) {
        // knight
        let pattern = [
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
                file: sq.file + pat.x,
                rank: sq.rank + pat.y
            };
            if (this.isOnBoard(d)) {
                const dp = this.getPiece(d);
                if (dp && dp.type === PieceType.Knight && dp.color === color) {
                    return true;
                }
            }
        }
        // pawn
        if (color === Color.White) {
            let d = { file: sq.file + 1, rank: sq.rank + 1 };
            let dp = this.getPiece(d);
            if (
                this.isOnBoard(d) &&
                dp &&
                dp.type === PieceType.Pawn &&
                dp.color !== color
            ) {
                return true;
            }
            d = { file: sq.file - 1, rank: sq.rank + 1 };
            dp = this.getPiece(d);
            if (
                this.isOnBoard(d) &&
                dp &&
                dp.type === PieceType.Pawn &&
                dp.color !== color
            ) {
                return true;
            }
        }
        if (color === Color.Black) {
            let d = { file: sq.file + 1, rank: sq.rank - 1 };
            let dp = this.getPiece(d);
            if (
                this.isOnBoard(d) &&
                dp &&
                dp.type === PieceType.Pawn &&
                dp.color !== color
            ) {
                return true;
            }
            d = { file: sq.file - 1, rank: sq.rank - 1 };
            dp = this.getPiece(d);
            if (
                this.isOnBoard(d) &&
                dp &&
                dp.type === PieceType.Pawn &&
                dp.color !== color
            ) {
                return true;
            }
        }
        // king
        pattern = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: -1, y: -1 },
            { x: -1, y: 1 },
            { x: 1, y: -1 }
        ];
        for (const pat of pattern) {
            const d = {
                file: sq.file + pat.x,
                rank: sq.rank + pat.y
            };
            if (this.isOnBoard(d)) {
                const dp = this.getPiece(d);
                if (dp && dp.type === PieceType.King && dp.color === color) {
                    return true;
                }
            }
        }
        // bishop/queen
        pattern = [
            { x: 1, y: 1 },
            { x: -1, y: -1 },
            { x: -1, y: 1 },
            { x: 1, y: -1 }
        ];
        for (const pat of pattern) {
            for (let i = 1; i < 8; i++) {
                const x = pat.x * i;
                const y = pat.y * i;
                const d = {
                    file: sq.file + x,
                    rank: sq.rank + y
                };
                if (this.isOnBoard(d)) {
                    const dp = this.getPiece(d);
                    if (dp) {
                        if (dp.color === color) {
                            if (
                                dp.type === PieceType.Queen ||
                                dp.type === PieceType.Bishop
                            ) {
                                return true;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                } else {
                    break;
                }
            }
        }
        // rook/queen
        pattern = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
        ];
        for (const pat of pattern) {
            for (let i = 1; i < 8; i++) {
                const x = pat.x * i;
                const y = pat.y * i;
                const d = {
                    file: sq.file + x,
                    rank: sq.rank + y
                };
                if (this.isOnBoard(d)) {
                    const dp = this.getPiece(d);
                    if (dp) {
                        if (dp.color === color) {
                            if (
                                dp.type === PieceType.Queen ||
                                dp.type === PieceType.Rook
                            ) {
                                return true;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                } else {
                    break;
                }
            }
        }
    }

    private getPieceMovements(): Move[] {
        const movements: Move[] = [];
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const p = this.getPiece({ file: f, rank: r });
                if (p && p.color === this.turn) {
                    let pattern;
                    switch (p.type) {
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
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            { file: f, rank: r },
                                            null
                                        );
                                        movements.push({
                                            src: {
                                                file: f,
                                                rank: r
                                            },
                                            dest: d,
                                            resultingBoard: newBoard
                                        });
                                    }
                                }
                            }
                            break;
                        case PieceType.King:
                            pattern = [
                                { x: 0, y: 1 },
                                { x: 0, y: -1 },
                                { x: -1, y: 0 },
                                { x: 1, y: 0 },
                                { x: 1, y: 1 },
                                { x: -1, y: -1 },
                                { x: -1, y: 1 },
                                { x: 1, y: -1 }
                            ];
                            for (const pat of pattern) {
                                const d = {
                                    file: f + pat.x,
                                    rank: r + pat.y
                                };
                                if (this.isOnBoard(d)) {
                                    const dp = this.getPiece(d);
                                    if (!(dp && dp.color === this.turn)) {
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            { file: f, rank: r },
                                            null
                                        );
                                        movements.push({
                                            src: {
                                                file: f,
                                                rank: r
                                            },
                                            dest: d,
                                            resultingBoard: newBoard
                                        });
                                    }
                                }
                            }
                            if (p.color === Color.White) {
                                if (f === File.e && r === Rank.ONE) {
                                    // kingside
                                    if (this.castlingRights.K) {
                                        const rook = this.getPiece({
                                            file: File.h,
                                            rank: Rank.ONE
                                        });
                                        if (
                                            !this.getPiece({
                                                file: File.f,
                                                rank: Rank.ONE
                                            }) &&
                                            !this.getPiece({
                                                file: File.g,
                                                rank: Rank.ONE
                                            }) &&
                                            rook &&
                                            rook.type === PieceType.Rook &&
                                            rook.color === p.color
                                        ) {
                                            // write an incheck function before
                                            // continuing
                                        }
                                    }
                                }
                            }
                            break;
                        case PieceType.Rook:
                            pattern = [
                                { x: 0, y: 1 },
                                { x: 0, y: -1 },
                                { x: -1, y: 0 },
                                { x: 1, y: 0 }
                            ];
                            for (const pat of pattern) {
                                let d = {
                                    file: f + pat.x,
                                    rank: r + pat.y
                                };
                                while (d) {
                                    if (this.isOnBoard(d)) {
                                        const dp = this.getPiece(d);
                                        if (dp) {
                                            if (dp.color !== this.turn) {
                                                const newBoard = new Game(
                                                    this.fen
                                                ).board;
                                                newBoard.insertPiece(d, p);
                                                newBoard.insertPiece(
                                                    { file: f, rank: r },
                                                    null
                                                );
                                                movements.push({
                                                    src: {
                                                        file: f,
                                                        rank: r
                                                    },
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                            d = null; // break loop
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                { file: f, rank: r },
                                                null
                                            );
                                            movements.push({
                                                src: {
                                                    file: f,
                                                    rank: r
                                                },
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                            d = {
                                                file: d.file + pat.x,
                                                rank: d.rank + pat.y
                                            };
                                        }
                                    } else {
                                        d = null; // break loop
                                    }
                                }
                            }
                            break;
                        case PieceType.Bishop:
                            pattern = [
                                { x: 1, y: 1 },
                                { x: -1, y: -1 },
                                { x: -1, y: 1 },
                                { x: 1, y: -1 }
                            ];
                            for (const pat of pattern) {
                                let d = {
                                    file: f + pat.x,
                                    rank: r + pat.y
                                };
                                while (d) {
                                    if (this.isOnBoard(d)) {
                                        const dp = this.getPiece(d);
                                        if (dp) {
                                            if (dp.color !== this.turn) {
                                                const newBoard = new Game(
                                                    this.fen
                                                ).board;
                                                newBoard.insertPiece(d, p);
                                                newBoard.insertPiece(
                                                    { file: f, rank: r },
                                                    null
                                                );
                                                movements.push({
                                                    src: {
                                                        file: f,
                                                        rank: r
                                                    },
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                            d = null; // break loop
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                { file: f, rank: r },
                                                null
                                            );
                                            movements.push({
                                                src: {
                                                    file: f,
                                                    rank: r
                                                },
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                            d = {
                                                file: d.file + pat.x,
                                                rank: d.rank + pat.y
                                            };
                                        }
                                    } else {
                                        d = null; // break loop
                                    }
                                }
                            }
                            break;
                        case PieceType.Queen:
                            pattern = [
                                { x: 0, y: 1 },
                                { x: 0, y: -1 },
                                { x: -1, y: 0 },
                                { x: 1, y: 0 },
                                { x: 1, y: 1 },
                                { x: -1, y: -1 },
                                { x: -1, y: 1 },
                                { x: 1, y: -1 }
                            ];
                            for (const pat of pattern) {
                                let d = {
                                    file: f + pat.x,
                                    rank: r + pat.y
                                };
                                while (d) {
                                    if (this.isOnBoard(d)) {
                                        const dp = this.getPiece(d);
                                        if (dp) {
                                            if (dp.color !== this.turn) {
                                                const newBoard = new Game(
                                                    this.fen
                                                ).board;
                                                newBoard.insertPiece(d, p);
                                                newBoard.insertPiece(
                                                    { file: f, rank: r },
                                                    null
                                                );
                                                movements.push({
                                                    src: {
                                                        file: f,
                                                        rank: r
                                                    },
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                            d = null; // break loop
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                { file: f, rank: r },
                                                null
                                            );
                                            movements.push({
                                                src: {
                                                    file: f,
                                                    rank: r
                                                },
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                            d = {
                                                file: d.file + pat.x,
                                                rank: d.rank + pat.y
                                            };
                                        }
                                    } else {
                                        d = null; // break loop
                                    }
                                }
                            }
                            break;
                        case PieceType.Pawn:
                            if (p.color === Color.White) {
                                // one sq forward
                                let d = {
                                    file: f,
                                    rank: r + 1
                                };
                                if (this.isOnBoard(d)) {
                                    let dp = this.getPiece(d);
                                    if (!dp) {
                                        if (d.rank === Rank.EIGHT) {
                                            // promoting
                                            let newBoard: Board;
                                            const promoPieces = [
                                                new Piece(
                                                    PieceType.Queen,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Rook,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Bishop,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Knight,
                                                    p.color
                                                )
                                            ];
                                            for (const pP of promoPieces) {
                                                newBoard = new Game(this.fen)
                                                    .board;
                                                newBoard.insertPiece(d, pP);
                                                newBoard.insertPiece(
                                                    { file: f, rank: r },
                                                    null
                                                );
                                                movements.push({
                                                    src: {
                                                        file: f,
                                                        rank: r
                                                    },
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                { file: f, rank: r },
                                                null
                                            );
                                            movements.push({
                                                src: {
                                                    file: f,
                                                    rank: r
                                                },
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                        if (r === Rank.TWO) {
                                            // two sqs forward
                                            d = {
                                                file: f,
                                                rank: r + 2
                                            };
                                            if (this.isOnBoard(d)) {
                                                dp = this.getPiece(d);
                                                if (!dp) {
                                                    const newBoard = new Game(
                                                        this.fen
                                                    ).board;
                                                    newBoard.insertPiece(d, p);
                                                    newBoard.insertPiece(
                                                        { file: f, rank: r },
                                                        null
                                                    );
                                                    movements.push({
                                                        src: {
                                                            file: f,
                                                            rank: r
                                                        },
                                                        dest: d,
                                                        resultingBoard: newBoard
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                                // capture +f
                                d = {
                                    file: f + 1,
                                    rank: r + 1
                                };
                                if (this.isOnBoard(d)) {
                                    const dp = this.getPiece(d);
                                    if (dp && dp.color !== p.color) {
                                        if (d.rank === Rank.EIGHT) {
                                            // promoting
                                            let newBoard: Board;
                                            const promoPieces = [
                                                new Piece(
                                                    PieceType.Queen,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Rook,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Bishop,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Knight,
                                                    p.color
                                                )
                                            ];
                                            for (const pP of promoPieces) {
                                                newBoard = new Game(this.fen)
                                                    .board;
                                                newBoard.insertPiece(d, pP);
                                                newBoard.insertPiece(
                                                    { file: f, rank: r },
                                                    null
                                                );
                                                movements.push({
                                                    src: {
                                                        file: f,
                                                        rank: r
                                                    },
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                { file: f, rank: r },
                                                null
                                            );
                                            movements.push({
                                                src: {
                                                    file: f,
                                                    rank: r
                                                },
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                    } else if (
                                        this.enPassant ===
                                        this.squareToString(d)
                                    ) {
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            { file: f, rank: r },
                                            null
                                        );
                                        newBoard.insertPiece(
                                            { file: f + 1, rank: r },
                                            null
                                        );
                                        movements.push({
                                            src: {
                                                file: f,
                                                rank: r
                                            },
                                            dest: d,
                                            resultingBoard: newBoard
                                        });
                                    }
                                }
                                // capture -f
                                d = {
                                    file: f - 1,
                                    rank: r + 1
                                };
                                if (this.isOnBoard(d)) {
                                    const dp = this.getPiece(d);
                                    if (dp && dp.color !== p.color) {
                                        if (d.rank === Rank.EIGHT) {
                                            // promoting
                                            let newBoard: Board;
                                            const promoPieces = [
                                                new Piece(
                                                    PieceType.Queen,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Rook,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Bishop,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Knight,
                                                    p.color
                                                )
                                            ];
                                            for (const pP of promoPieces) {
                                                newBoard = new Game(this.fen)
                                                    .board;
                                                newBoard.insertPiece(d, pP);
                                                newBoard.insertPiece(
                                                    { file: f, rank: r },
                                                    null
                                                );
                                                movements.push({
                                                    src: {
                                                        file: f,
                                                        rank: r
                                                    },
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                { file: f, rank: r },
                                                null
                                            );
                                            movements.push({
                                                src: {
                                                    file: f,
                                                    rank: r
                                                },
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                    } else if (
                                        this.enPassant ===
                                        this.squareToString(d)
                                    ) {
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            { file: f, rank: r },
                                            null
                                        );
                                        newBoard.insertPiece(
                                            { file: f - 1, rank: r },
                                            null
                                        );
                                        movements.push({
                                            src: {
                                                file: f,
                                                rank: r
                                            },
                                            dest: d,
                                            resultingBoard: newBoard
                                        });
                                    }
                                }
                            } else {
                                // one sq forward
                                let d = {
                                    file: f,
                                    rank: r - 1
                                };
                                if (this.isOnBoard(d)) {
                                    let dp = this.getPiece(d);
                                    if (!dp) {
                                        if (d.rank === Rank.ONE) {
                                            // promoting
                                            let newBoard: Board;
                                            const promoPieces = [
                                                new Piece(
                                                    PieceType.Queen,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Rook,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Bishop,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Knight,
                                                    p.color
                                                )
                                            ];
                                            for (const pP of promoPieces) {
                                                newBoard = new Game(this.fen)
                                                    .board;
                                                newBoard.insertPiece(d, pP);
                                                newBoard.insertPiece(
                                                    { file: f, rank: r },
                                                    null
                                                );
                                                movements.push({
                                                    src: {
                                                        file: f,
                                                        rank: r
                                                    },
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                { file: f, rank: r },
                                                null
                                            );
                                            movements.push({
                                                src: {
                                                    file: f,
                                                    rank: r
                                                },
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                        if (r === Rank.SEVEN) {
                                            // two sqs forward
                                            d = {
                                                file: f,
                                                rank: r - 2
                                            };
                                            if (this.isOnBoard(d)) {
                                                dp = this.getPiece(d);
                                                if (!dp) {
                                                    const newBoard = new Game(
                                                        this.fen
                                                    ).board;
                                                    newBoard.insertPiece(d, p);
                                                    newBoard.insertPiece(
                                                        { file: f, rank: r },
                                                        null
                                                    );
                                                    movements.push({
                                                        src: {
                                                            file: f,
                                                            rank: r
                                                        },
                                                        dest: d,
                                                        resultingBoard: newBoard
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                                // capture +f
                                d = {
                                    file: f + 1,
                                    rank: r - 1
                                };
                                if (this.isOnBoard(d)) {
                                    const dp = this.getPiece(d);
                                    if (dp && dp.color !== p.color) {
                                        if (d.rank === Rank.ONE) {
                                            // promoting
                                            let newBoard: Board;
                                            const promoPieces = [
                                                new Piece(
                                                    PieceType.Queen,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Rook,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Bishop,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Knight,
                                                    p.color
                                                )
                                            ];
                                            for (const pP of promoPieces) {
                                                newBoard = new Game(this.fen)
                                                    .board;
                                                newBoard.insertPiece(d, pP);
                                                newBoard.insertPiece(
                                                    { file: f, rank: r },
                                                    null
                                                );
                                                movements.push({
                                                    src: {
                                                        file: f,
                                                        rank: r
                                                    },
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                { file: f, rank: r },
                                                null
                                            );
                                            movements.push({
                                                src: {
                                                    file: f,
                                                    rank: r
                                                },
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                    } else if (
                                        this.enPassant ===
                                        this.squareToString(d)
                                    ) {
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            { file: f, rank: r },
                                            null
                                        );
                                        newBoard.insertPiece(
                                            { file: f + 1, rank: r },
                                            null
                                        );
                                        movements.push({
                                            src: {
                                                file: f,
                                                rank: r
                                            },
                                            dest: d,
                                            resultingBoard: newBoard
                                        });
                                    }
                                }
                                // capture -f
                                d = {
                                    file: f - 1,
                                    rank: r - 1
                                };
                                if (this.isOnBoard(d)) {
                                    const dp = this.getPiece(d);
                                    if (dp && dp.color !== p.color) {
                                        if (d.rank === Rank.ONE) {
                                            // promoting
                                            let newBoard: Board;
                                            const promoPieces = [
                                                new Piece(
                                                    PieceType.Queen,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Rook,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Bishop,
                                                    p.color
                                                ),
                                                new Piece(
                                                    PieceType.Knight,
                                                    p.color
                                                )
                                            ];
                                            for (const pP of promoPieces) {
                                                newBoard = new Game(this.fen)
                                                    .board;
                                                newBoard.insertPiece(d, pP);
                                                newBoard.insertPiece(
                                                    { file: f, rank: r },
                                                    null
                                                );
                                                movements.push({
                                                    src: {
                                                        file: f,
                                                        rank: r
                                                    },
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                { file: f, rank: r },
                                                null
                                            );
                                            movements.push({
                                                src: {
                                                    file: f,
                                                    rank: r
                                                },
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                    } else if (
                                        this.enPassant ===
                                        this.squareToString(d)
                                    ) {
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            { file: f, rank: r },
                                            null
                                        );
                                        newBoard.insertPiece(
                                            { file: f - 1, rank: r },
                                            null
                                        );
                                        movements.push({
                                            src: {
                                                file: f,
                                                rank: r
                                            },
                                            dest: d,
                                            resultingBoard: newBoard
                                        });
                                    }
                                }
                            }
                            break;
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
