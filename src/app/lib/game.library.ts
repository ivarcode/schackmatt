import { Board } from './board.library';
import { Move } from './interface.library';
import { Piece } from './piece.libary';
import { Square } from './square.library';
import { fileToString, Rank, File, PieceType, Color } from './util.library';

export class Game {
    private fen: string;
    private pgn: string;
    private board: Board;
    private turn: Color;
    private moveHistory: Move[];
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
        this.loadFEN();
        this.moveHistory = [];
    }

    public toString(): string {
        let str = 'GAME\n----\n';
        str += this.board;
        str += '\nfen = ' + this.fen;
        str += '\npgn = ' + this.pgn;
        // str += '\nen passant = ' + this.enPassant;
        // str += '\nturn = ' + this.turn;
        // str += '  halfmove = ' + this.halfmove;
        // str += '  fullmove = ' + this.fullmove;
        // str += '\ncastling = ' + JSON.stringify(this.castlingRights);
        return str + '\n----';
    }

    // prepares the game object from the fen data
    public loadFEN(): void {
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
                                halfmove += rest.substr(0, r);
                                rest = rest.substr(r + 1);
                                break;
                            }
                        }
                        this.halfmove = +halfmove; // fun way to convert to int
                        // fullmove
                        this.fullmove = +rest; // fun way to convert to int
                        // end initial for loop
                        i = this.fen.length;
                    } else {
                        switch (this.fen.charAt(i)) {
                            case 'r':
                                board.insertPiece(
                                    new Square(fileIndex, rankIndex),
                                    new Piece(PieceType.Rook, Color.Black)
                                );
                                break;
                            case 'R':
                                board.insertPiece(
                                    new Square(fileIndex, rankIndex),
                                    new Piece(PieceType.Rook, Color.White)
                                );
                                break;
                            case 'n':
                                board.insertPiece(
                                    new Square(fileIndex, rankIndex),
                                    new Piece(PieceType.Knight, Color.Black)
                                );
                                break;
                            case 'N':
                                board.insertPiece(
                                    new Square(fileIndex, rankIndex),
                                    new Piece(PieceType.Knight, Color.White)
                                );
                                break;
                            case 'b':
                                if (spacesHit > 0) {
                                    this.turn = Color.Black;
                                } else {
                                    board.insertPiece(
                                        new Square(fileIndex, rankIndex),
                                        new Piece(PieceType.Bishop, Color.Black)
                                    );
                                }
                                break;
                            case 'w':
                                this.turn = Color.White;
                                break;
                            case 'B':
                                board.insertPiece(
                                    new Square(fileIndex, rankIndex),
                                    new Piece(PieceType.Bishop, Color.White)
                                );
                                break;
                            case 'q':
                                if (spacesHit > 0) {
                                    this.castlingRights.q = true;
                                } else {
                                    board.insertPiece(
                                        new Square(fileIndex, rankIndex),
                                        new Piece(PieceType.Queen, Color.Black)
                                    );
                                }
                                break;
                            case 'Q':
                                if (spacesHit > 0) {
                                    this.castlingRights.Q = true;
                                } else {
                                    board.insertPiece(
                                        new Square(fileIndex, rankIndex),
                                        new Piece(PieceType.Queen, Color.White)
                                    );
                                }
                                break;
                            case 'k':
                                if (spacesHit > 0) {
                                    this.castlingRights.k = true;
                                } else {
                                    board.insertPiece(
                                        new Square(fileIndex, rankIndex),
                                        new Piece(PieceType.King, Color.Black)
                                    );
                                }
                                break;
                            case 'K':
                                if (spacesHit > 0) {
                                    this.castlingRights.K = true;
                                } else {
                                    board.insertPiece(
                                        new Square(fileIndex, rankIndex),
                                        new Piece(PieceType.King, Color.White)
                                    );
                                }
                                break;
                            case 'p':
                                board.insertPiece(
                                    new Square(fileIndex, rankIndex),
                                    new Piece(PieceType.Pawn, Color.Black)
                                );
                                break;
                            case 'P':
                                board.insertPiece(
                                    new Square(fileIndex, rankIndex),
                                    new Piece(PieceType.Pawn, Color.White)
                                );
                                break;
                            default:
                                // number case
                                fileIndex +=
                                    // tslint:disable-next-line: radix
                                    Number.parseInt(this.fen.charAt(i)) - 1;
                                break;
                        }
                    }
                    fileIndex++;
                    break;
            }
        }
        this.board = board;
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
            const d = new Square(sq.file + pat.x, sq.rank + pat.y);
            if (this.isOnBoard(d)) {
                const dp = this.getPiece(d);
                if (dp && dp.type === PieceType.Knight && dp.color === color) {
                    return true;
                }
            }
        }
        // pawn
        if (color === Color.Black) {
            let d = new Square(sq.file + 1, sq.rank + 1);
            let dp;
            if (d.file < 8 && d.file >= 0 && d.rank < 8 && d.rank >= 0) {
                dp = this.getPiece(d);
                if (
                    this.isOnBoard(d) &&
                    dp &&
                    dp.type === PieceType.Pawn &&
                    dp.color === color
                ) {
                    return true;
                }
            }

            d = new Square(sq.file - 1, sq.rank + 1);
            if (d.file < 8 && d.file >= 0 && d.rank < 8 && d.rank >= 0) {
                dp = this.getPiece(d);
                if (
                    this.isOnBoard(d) &&
                    dp &&
                    dp.type === PieceType.Pawn &&
                    dp.color === color
                ) {
                    return true;
                }
            }
        }
        if (color === Color.White) {
            let d = new Square(sq.file + 1, sq.rank - 1);
            let dp;
            if (d.file < 8 && d.file >= 0 && d.rank < 8 && d.rank >= 0) {
                dp = this.getPiece(d);
                if (
                    this.isOnBoard(d) &&
                    dp &&
                    dp.type === PieceType.Pawn &&
                    dp.color === color
                ) {
                    return true;
                }
            }
            d = new Square(sq.file - 1, sq.rank - 1);
            if (d.file < 8 && d.file >= 0 && d.rank < 8 && d.rank >= 0) {
                dp = this.getPiece(d);
                if (
                    this.isOnBoard(d) &&
                    dp &&
                    dp.type === PieceType.Pawn &&
                    dp.color === color
                ) {
                    return true;
                }
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
            const d = new Square(sq.file + pat.x, sq.rank + pat.y);
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
                const d = new Square(sq.file + x, sq.rank + y);
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
                const d = new Square(sq.file + x, sq.rank + y);
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

    public getPieceMovements(): Move[] {
        const movements: Move[] = [];
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const p = this.getPiece(new Square(f, r));
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
                                const d = new Square(f + pat.x, r + pat.y);
                                if (this.isOnBoard(d)) {
                                    const dp = this.getPiece(d);
                                    if (!(dp && dp.color === this.turn)) {
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            new Square(f, r),
                                            null
                                        );
                                        movements.push({
                                            notation: null,
                                            preMoveFEN: this.getFEN(),
                                            src: new Square(f, r),
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
                                const d = new Square(f + pat.x, r + pat.y);
                                if (this.isOnBoard(d)) {
                                    const dp = this.getPiece(d);
                                    if (!(dp && dp.color === this.turn)) {
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            new Square(f, r),
                                            null
                                        );
                                        movements.push({
                                            notation: null,
                                            preMoveFEN: this.getFEN(),
                                            src: new Square(f, r),
                                            dest: d,
                                            resultingBoard: newBoard
                                        });
                                    }
                                }
                            }
                            // castling
                            if (p.color === Color.White) {
                                if (f === File.e && r === Rank.ONE) {
                                    // kingside
                                    if (this.castlingRights.K) {
                                        const rook = this.getPiece(
                                            new Square(File.h, Rank.ONE)
                                        );
                                        if (
                                            !this.getPiece(
                                                new Square(File.f, Rank.ONE)
                                            ) &&
                                            !this.getPiece(
                                                new Square(File.g, Rank.ONE)
                                            ) &&
                                            rook &&
                                            rook.type === PieceType.Rook &&
                                            rook.color === p.color &&
                                            !this.isThreatenedBy(
                                                new Square(File.e, Rank.ONE),
                                                Color.Black
                                            ) &&
                                            !this.isThreatenedBy(
                                                new Square(File.f, Rank.ONE),
                                                Color.Black
                                            )
                                        ) {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(
                                                new Square(File.g, Rank.ONE),
                                                p
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.f, Rank.ONE),
                                                new Piece(
                                                    PieceType.Rook,
                                                    p.color
                                                )
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.e, Rank.ONE),
                                                null
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.h, Rank.ONE),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(
                                                    File.e,
                                                    Rank.ONE
                                                ),
                                                dest: new Square(
                                                    File.g,
                                                    Rank.ONE
                                                ),
                                                resultingBoard: newBoard
                                            });
                                        }
                                    }
                                    // queenside
                                    if (this.castlingRights.Q) {
                                        const rook = this.getPiece(
                                            new Square(File.a, Rank.ONE)
                                        );
                                        if (
                                            !this.getPiece(
                                                new Square(File.d, Rank.ONE)
                                            ) &&
                                            !this.getPiece(
                                                new Square(File.c, Rank.ONE)
                                            ) &&
                                            !this.getPiece(
                                                new Square(File.b, Rank.ONE)
                                            ) &&
                                            rook &&
                                            rook.type === PieceType.Rook &&
                                            rook.color === p.color &&
                                            !this.isThreatenedBy(
                                                new Square(File.e, Rank.ONE),
                                                Color.Black
                                            ) &&
                                            !this.isThreatenedBy(
                                                new Square(File.d, Rank.ONE),
                                                Color.Black
                                            )
                                        ) {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(
                                                new Square(File.c, Rank.ONE),
                                                p
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.d, Rank.ONE),
                                                new Piece(
                                                    PieceType.Rook,
                                                    p.color
                                                )
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.e, Rank.ONE),
                                                null
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.a, Rank.ONE),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(
                                                    File.e,
                                                    Rank.ONE
                                                ),
                                                dest: new Square(
                                                    File.c,
                                                    Rank.ONE
                                                ),
                                                resultingBoard: newBoard
                                            });
                                        }
                                    }
                                }
                            }
                            if (p.color === Color.Black) {
                                if (f === File.e && r === Rank.EIGHT) {
                                    // kingside
                                    if (this.castlingRights.k) {
                                        const rook = this.getPiece(
                                            new Square(File.h, Rank.EIGHT)
                                        );
                                        if (
                                            !this.getPiece(
                                                new Square(File.f, Rank.EIGHT)
                                            ) &&
                                            !this.getPiece(
                                                new Square(File.g, Rank.EIGHT)
                                            ) &&
                                            rook &&
                                            rook.type === PieceType.Rook &&
                                            rook.color === p.color &&
                                            !this.isThreatenedBy(
                                                new Square(File.e, Rank.EIGHT),
                                                Color.White
                                            ) &&
                                            !this.isThreatenedBy(
                                                new Square(File.f, Rank.EIGHT),
                                                Color.White
                                            )
                                        ) {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(
                                                new Square(File.g, Rank.EIGHT),
                                                p
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.f, Rank.EIGHT),
                                                new Piece(
                                                    PieceType.Rook,
                                                    p.color
                                                )
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.e, Rank.EIGHT),
                                                null
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.h, Rank.EIGHT),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(
                                                    File.e,
                                                    Rank.EIGHT
                                                ),
                                                dest: new Square(
                                                    File.g,
                                                    Rank.EIGHT
                                                ),
                                                resultingBoard: newBoard
                                            });
                                        }
                                    }
                                    // queenside
                                    if (this.castlingRights.q) {
                                        const rook = this.getPiece(
                                            new Square(File.a, Rank.EIGHT)
                                        );
                                        if (
                                            !this.getPiece(
                                                new Square(File.d, Rank.EIGHT)
                                            ) &&
                                            !this.getPiece(
                                                new Square(File.c, Rank.EIGHT)
                                            ) &&
                                            !this.getPiece(
                                                new Square(File.b, Rank.EIGHT)
                                            ) &&
                                            rook &&
                                            rook.type === PieceType.Rook &&
                                            rook.color === p.color &&
                                            !this.isThreatenedBy(
                                                new Square(File.e, Rank.EIGHT),
                                                Color.White
                                            ) &&
                                            !this.isThreatenedBy(
                                                new Square(File.d, Rank.EIGHT),
                                                Color.White
                                            )
                                        ) {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(
                                                new Square(File.c, Rank.EIGHT),
                                                p
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.d, Rank.EIGHT),
                                                new Piece(
                                                    PieceType.Rook,
                                                    p.color
                                                )
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.e, Rank.EIGHT),
                                                null
                                            );
                                            newBoard.insertPiece(
                                                new Square(File.a, Rank.EIGHT),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(
                                                    File.e,
                                                    Rank.EIGHT
                                                ),
                                                dest: new Square(
                                                    File.c,
                                                    Rank.EIGHT
                                                ),
                                                resultingBoard: newBoard
                                            });
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
                                let d = new Square(f + pat.x, r + pat.y);
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
                                                    new Square(f, r),
                                                    null
                                                );
                                                movements.push({
                                                    notation: null,
                                                    preMoveFEN: this.getFEN(),
                                                    src: new Square(f, r),
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
                                                new Square(f, r),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(f, r),
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                            d = new Square(
                                                d.file + pat.x,
                                                d.rank + pat.y
                                            );
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
                                let d = new Square(f + pat.x, r + pat.y);
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
                                                    new Square(f, r),
                                                    null
                                                );
                                                movements.push({
                                                    notation: null,
                                                    preMoveFEN: this.getFEN(),
                                                    src: new Square(f, r),
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
                                                new Square(f, r),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(f, r),
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                            d = new Square(
                                                d.file + pat.x,
                                                d.rank + pat.y
                                            );
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
                                let d = new Square(f + pat.x, r + pat.y);
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
                                                    new Square(f, r),
                                                    null
                                                );
                                                movements.push({
                                                    notation: null,
                                                    preMoveFEN: this.getFEN(),
                                                    src: new Square(f, r),
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
                                                new Square(f, r),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(f, r),
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                            d = new Square(
                                                d.file + pat.x,
                                                d.rank + pat.y
                                            );
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
                                let d = new Square(f, r + 1);
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
                                                    new Square(f, r),
                                                    null
                                                );
                                                movements.push({
                                                    notation: null,
                                                    preMoveFEN: this.getFEN(),
                                                    src: new Square(f, r),
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                new Square(f, r),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(f, r),
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                        if (r === Rank.TWO) {
                                            // two sqs forward
                                            d = new Square(f, r + 2);
                                            if (this.isOnBoard(d)) {
                                                dp = this.getPiece(d);
                                                if (!dp) {
                                                    const newBoard = new Game(
                                                        this.fen
                                                    ).board;
                                                    newBoard.insertPiece(d, p);
                                                    newBoard.insertPiece(
                                                        new Square(f, r),
                                                        null
                                                    );
                                                    movements.push({
                                                        notation: null,
                                                        preMoveFEN: this.getFEN(),
                                                        src: new Square(f, r),
                                                        dest: d,
                                                        resultingBoard: newBoard
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                                // capture +f
                                d = new Square(f + 1, r + 1);
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
                                                    new Square(f, r),
                                                    null
                                                );
                                                movements.push({
                                                    notation: null,
                                                    preMoveFEN: this.getFEN(),
                                                    src: new Square(f, r),
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                new Square(f, r),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(f, r),
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                    } else if (
                                        this.enPassant === d.toString()
                                    ) {
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            new Square(f, r),
                                            null
                                        );
                                        newBoard.insertPiece(
                                            new Square(f + 1, r),
                                            null
                                        );
                                        movements.push({
                                            notation: null,
                                            preMoveFEN: this.getFEN(),
                                            src: new Square(f, r),
                                            dest: d,
                                            resultingBoard: newBoard
                                        });
                                    }
                                }
                                // capture -f
                                d = new Square(f - 1, r + 1);
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
                                                    new Square(f, r),
                                                    null
                                                );
                                                movements.push({
                                                    notation: null,
                                                    preMoveFEN: this.getFEN(),
                                                    src: new Square(f, r),
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                new Square(f, r),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(f, r),
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                    } else if (
                                        this.enPassant === d.toString()
                                    ) {
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            new Square(f, r),
                                            null
                                        );
                                        newBoard.insertPiece(
                                            new Square(f - 1, r),
                                            null
                                        );
                                        movements.push({
                                            notation: null,
                                            preMoveFEN: this.getFEN(),
                                            src: new Square(f, r),
                                            dest: d,
                                            resultingBoard: newBoard
                                        });
                                    }
                                }
                            } else {
                                // one sq forward
                                let d = new Square(f, r - 1);
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
                                                    new Square(f, r),
                                                    null
                                                );
                                                movements.push({
                                                    notation: null,
                                                    preMoveFEN: this.getFEN(),
                                                    src: new Square(f, r),
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                new Square(f, r),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(f, r),
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                        if (r === Rank.SEVEN) {
                                            // two sqs forward
                                            d = new Square(f, r - 2);
                                            if (this.isOnBoard(d)) {
                                                dp = this.getPiece(d);
                                                if (!dp) {
                                                    const newBoard = new Game(
                                                        this.fen
                                                    ).board;
                                                    newBoard.insertPiece(d, p);
                                                    newBoard.insertPiece(
                                                        new Square(f, r),
                                                        null
                                                    );
                                                    movements.push({
                                                        notation: null,
                                                        preMoveFEN: this.getFEN(),
                                                        src: new Square(f, r),
                                                        dest: d,
                                                        resultingBoard: newBoard
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                                // capture +f
                                d = new Square(f + 1, r - 1);
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
                                                    new Square(f, r),
                                                    null
                                                );
                                                movements.push({
                                                    notation: null,
                                                    preMoveFEN: this.getFEN(),
                                                    src: new Square(f, r),
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                new Square(f, r),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(f, r),
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                    } else if (
                                        this.enPassant === d.toString()
                                    ) {
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            new Square(f, r),
                                            null
                                        );
                                        newBoard.insertPiece(
                                            new Square(f + 1, r),
                                            null
                                        );
                                        movements.push({
                                            notation: null,
                                            preMoveFEN: this.getFEN(),
                                            src: new Square(f, r),
                                            dest: d,
                                            resultingBoard: newBoard
                                        });
                                    }
                                }
                                // capture -f
                                d = new Square(f - 1, r - 1);
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
                                                    new Square(f, r),
                                                    null
                                                );
                                                movements.push({
                                                    notation: null,
                                                    preMoveFEN: this.getFEN(),
                                                    src: new Square(f, r),
                                                    dest: d,
                                                    resultingBoard: newBoard
                                                });
                                            }
                                        } else {
                                            const newBoard = new Game(this.fen)
                                                .board;
                                            newBoard.insertPiece(d, p);
                                            newBoard.insertPiece(
                                                new Square(f, r),
                                                null
                                            );
                                            movements.push({
                                                notation: null,
                                                preMoveFEN: this.getFEN(),
                                                src: new Square(f, r),
                                                dest: d,
                                                resultingBoard: newBoard
                                            });
                                        }
                                    } else if (
                                        this.enPassant === d.toString()
                                    ) {
                                        const newBoard = new Game(this.fen)
                                            .board;
                                        newBoard.insertPiece(d, p);
                                        newBoard.insertPiece(
                                            new Square(f, r),
                                            null
                                        );
                                        newBoard.insertPiece(
                                            new Square(f - 1, r),
                                            null
                                        );
                                        movements.push({
                                            notation: null,
                                            preMoveFEN: this.getFEN(),
                                            src: new Square(f, r),
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

    public getLegalMoves(): Move[] {
        const moves = this.getPieceMovements();
        // console.log('moves', moves);
        // console.log('FIND KING', this.turn, 'at ', sq);
        for (let i = 0; i < moves.length; i++) {
            const tempGame = new Game(this.fen);
            tempGame.setBoard(moves[i].resultingBoard);
            const sq = tempGame.findKing(this.turn);
            if (this.turn === Color.White) {
                if (tempGame.isThreatenedBy(sq, Color.Black)) {
                    moves.splice(i, 1);
                    i--;
                }
            } else {
                if (tempGame.isThreatenedBy(sq, Color.White)) {
                    moves.splice(i, 1);
                    i--;
                }
            }
        }
        // console.log('moves after checks filtered', moves);
        return moves;
    }

    public getNotation(move: Move): string {
        let notation = null;
        if (notation === null) {
            notation = '';
            const preMoveGame = new Game(move.preMoveFEN);
            // add piece
            const piece = preMoveGame
                .getPiece(move.src)
                .toString()
                .toUpperCase();
            notation += piece !== 'P' ? piece : '';
            // if piece src conflict
            if (piece === 'P') {
                // we always include src file for pawns capturing
                if (move.src.file !== move.dest.file) {
                    notation += fileToString(move.src.file);
                }
            } else {
                const allMoves = preMoveGame.getLegalMoves();
                const conflictMoves = [];
                for (const m of allMoves) {
                    if (
                        preMoveGame.getPiece(m.src).toString().toUpperCase() ===
                            piece &&
                        m.dest.file === move.dest.file &&
                        m.dest.rank === move.dest.rank
                    ) {
                        conflictMoves.push(m);
                    }
                }
                if (conflictMoves.length > 1) {
                    // console.log('conflicts', conflictMoves);
                    let fileConflict = false;
                    let rankConflict = false;
                    for (const c of conflictMoves) {
                        if (
                            move.src.file === c.src.file &&
                            move.src.rank === c.src.rank
                        ) {
                            // do nothing, this is the piece we are notating
                        } else {
                            if (move.src.file === c.src.file) {
                                fileConflict = true;
                            }
                            if (move.src.rank === c.src.rank) {
                                rankConflict = true;
                            }
                        }
                    }
                    if (rankConflict) {
                        notation += fileToString(move.src.file);
                    }
                    if (fileConflict) {
                        notation += move.src.rank + 1;
                    }
                    if (!fileConflict && !rankConflict) {
                        notation += fileToString(move.src.file);
                    }
                }
            }
            // if capture
            if (piece === 'P') {
                if (move.src.file !== move.dest.file) {
                    notation += 'x';
                }
            } else {
                if (preMoveGame.getPiece(move.dest)) {
                    notation += 'x';
                }
            }
            // dest
            notation += move.dest.toString();
            // castling
            if (piece === 'K') {
                if (move.src.file === File.e) {
                    if (move.dest.file === File.g) {
                        notation = 'O-O';
                    } else if (move.dest.file === File.c) {
                        notation = 'O-O-O';
                    }
                }
            }
            // promotion
            if (piece === 'P') {
                if (
                    move.dest.rank === Rank.EIGHT ||
                    move.dest.rank === Rank.ONE
                ) {
                    const promotingTo = move.resultingBoard.getPiece(move.dest);
                    notation += '=' + promotingTo.toString().toUpperCase();
                }
            }
            // check/checkmate/stalemate
            const postMoveGame = new Game(preMoveGame.getNextFENFromMove(move));
            if (postMoveGame.isCheck()) {
                if (postMoveGame.isCheckmate()) {
                    notation += '#';
                } else {
                    notation += '+';
                }
            } else {
                if (postMoveGame.isStalemate()) {
                    // do nothing --but we may want to do something here
                }
            }
        }
        return notation;
    }

    public findKing(color: Color): Square {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const sq = new Square(i, j);
                const p = this.getPiece(sq);
                if (p && p.type === PieceType.King && p.color === color) {
                    return sq;
                }
            }
        }
        return null;
    }

    private addMoveToPGN(move: Move): void {
        if (this.turn === Color.White) {
            this.pgn += (this.fullmove === 1 ? '' : ' ') + this.fullmove + '.';
        }
        this.pgn += ' ' + move.notation;
        this.moveHistory.push(move);
    }

    public makeMove(moveNotation: string): void {
        let move: Move;
        const legalMoves = this.getLegalMoves();
        for (const m of legalMoves) {
            m.notation = this.getNotation(m);
            if (m.notation === moveNotation) {
                move = m;
            }
        }
        // console.log('move', move);
        this.addMoveToPGN(move);

        if (this.board.getPiece(move.dest)) {
            this.board.captured.push(this.board.getPiece(move.dest));
        }
        const newFEN = this.getNextFENFromMove(move);
        this.fen = newFEN;
        this.loadFEN();
        // console.log(this.toString());
    }

    public isStalemate(): boolean {
        if (!this.isCheck() && this.getLegalMoves().length === 0) {
            return true;
        }
        return false;
    }

    public isCheckmate(): boolean {
        if (this.isCheck() && this.getLegalMoves().length === 0) {
            return true;
        }
        return false;
    }

    public isCheck(): boolean {
        if (this.turn === Color.Black) {
            // console.log('finding black king');
            const kingSquare = this.findKing(Color.Black);
            if (this.isThreatenedBy(kingSquare, Color.White)) {
                return true;
            }
        } else {
            // console.log('finding white king');
            const kingSquare = this.findKing(Color.White);
            if (this.isThreatenedBy(kingSquare, Color.Black)) {
                return true;
            }
        }
        return false;
    }

    public getNextFENFromMove(move: Move): string {
        // TODO first part of this function can utilize
        // this.getBoardString
        let newFEN = '';
        // whole board
        for (let i = 0; i < 8; i++) {
            let empties = 0;
            for (let j = 0; j < 8; j++) {
                const piece = move.resultingBoard.getPiece(
                    new Square(j, 7 - i)
                );
                if (piece) {
                    if (empties > 0) {
                        newFEN += empties;
                        empties = 0;
                    }
                    newFEN += this.pieceToCharSymbol(piece);
                } else {
                    empties++;
                }
            }
            if (empties > 0) {
                newFEN += empties;
            }
            if (i !== 7) {
                newFEN += '/';
            }
        }
        // switch color
        if (this.turn === Color.White) {
            newFEN += ' b ';
        } else {
            newFEN += ' w ';
        }
        // update castling data
        if (this.castlingRights.K) {
            if (
                (move.src.file === File.e && move.src.rank === Rank.ONE) ||
                (move.src.file === File.h && move.src.rank === Rank.ONE) ||
                (move.dest.file === File.e && move.dest.rank === Rank.ONE) ||
                (move.dest.file === File.h && move.dest.rank === Rank.ONE)
            ) {
                this.castlingRights.K = false;
            }
        }
        if (this.castlingRights.Q) {
            if (
                (move.src.file === File.e && move.src.rank === Rank.ONE) ||
                (move.src.file === File.a && move.src.rank === Rank.ONE) ||
                (move.dest.file === File.e && move.dest.rank === Rank.ONE) ||
                (move.dest.file === File.a && move.dest.rank === Rank.ONE)
            ) {
                this.castlingRights.Q = false;
            }
        }
        if (this.castlingRights.k) {
            if (
                (move.src.file === File.e && move.src.rank === Rank.EIGHT) ||
                (move.src.file === File.h && move.src.rank === Rank.EIGHT) ||
                (move.dest.file === File.e && move.dest.rank === Rank.EIGHT) ||
                (move.dest.file === File.h && move.dest.rank === Rank.EIGHT)
            ) {
                this.castlingRights.k = false;
            }
        }
        if (this.castlingRights.q) {
            if (
                (move.src.file === File.e && move.src.rank === Rank.EIGHT) ||
                (move.src.file === File.a && move.src.rank === Rank.EIGHT) ||
                (move.dest.file === File.e && move.dest.rank === Rank.EIGHT) ||
                (move.dest.file === File.a && move.dest.rank === Rank.EIGHT)
            ) {
                this.castlingRights.q = false;
            }
        }
        // add castling data
        if (this.castlingRights.K) {
            newFEN += 'K';
        }
        if (this.castlingRights.Q) {
            newFEN += 'Q';
        }
        if (this.castlingRights.k) {
            newFEN += 'k';
        }
        if (this.castlingRights.q) {
            newFEN += 'q';
        }
        if (
            this.castlingRights.K ||
            this.castlingRights.Q ||
            this.castlingRights.k ||
            this.castlingRights.q
        ) {
            newFEN += ' ';
        } else {
            newFEN += '- ';
        }
        // add en passant?
        if (
            move.dest.rank === Rank.FOUR &&
            move.src.rank === Rank.TWO &&
            move.resultingBoard.getPiece(move.dest).type === PieceType.Pawn &&
            move.resultingBoard.getPiece(move.dest).color === Color.White
        ) {
            const enPassantSqString = new Square(
                move.dest.file,
                Rank.THREE
            ).toString();
            const enPassantTestGame = new Game(
                newFEN + enPassantSqString + ' 0 1'
            );
            const arrayOfMTCBP = enPassantTestGame.getLegalMoves();
            // console.log('array', arrayOfMTCBP);
            let addEnPassantSqToFEN = false;
            for (const possibleMove of arrayOfMTCBP) {
                // console.log(
                //     enPassantSqString,
                //     squareToString(possibleMove.dest)
                // );
                if (
                    enPassantSqString === possibleMove.dest.toString() &&
                    possibleMove.resultingBoard.getPiece(possibleMove.dest)
                        .type === PieceType.Pawn
                ) {
                    addEnPassantSqToFEN = true;
                }
            }
            if (addEnPassantSqToFEN) {
                newFEN += enPassantSqString;
            } else {
                newFEN += '-';
            }
        } else if (
            move.dest.rank === Rank.FIVE &&
            move.src.rank === Rank.SEVEN &&
            move.resultingBoard.getPiece(move.dest).type === PieceType.Pawn &&
            move.resultingBoard.getPiece(move.dest).color === Color.Black
        ) {
            const enPassantSqString = new Square(
                move.dest.file,
                Rank.SIX
            ).toString();
            const enPassantTestGame = new Game(
                newFEN + enPassantSqString + ' 0 1'
            );
            const arrayOfMTCBP = enPassantTestGame.getLegalMoves();
            // console.log('array', arrayOfMTCBP);
            let addEnPassantSqToFEN = false;
            for (const possibleMove of arrayOfMTCBP) {
                // console.log(
                //     enPassantSqString,
                //     squareToString(possibleMove.dest)
                // );
                if (
                    enPassantSqString === possibleMove.dest.toString() &&
                    possibleMove.resultingBoard.getPiece(possibleMove.dest)
                        .type === PieceType.Pawn
                ) {
                    addEnPassantSqToFEN = true;
                }
            }
            if (addEnPassantSqToFEN) {
                newFEN += enPassantSqString;
            } else {
                newFEN += '-';
            }
        } else {
            newFEN += '-';
        }
        newFEN += ' ';
        // update halfmove
        if (
            this.board.getPiece(move.src).type === PieceType.Pawn ||
            this.board.getPiece(move.dest)
        ) {
            newFEN += '0';
        } else {
            newFEN += this.halfmove + 1;
        }
        newFEN += ' ';
        // update fullmove
        if (this.turn === Color.Black) {
            newFEN += this.fullmove + 1;
        } else {
            newFEN += this.fullmove;
        }
        return newFEN;
    }

    private pieceToCharSymbol(piece: Piece): string {
        let character: string;
        switch (piece.type) {
            case PieceType.Bishop:
                character = 'b';
                break;
            case PieceType.King:
                character = 'k';
                break;
            case PieceType.Queen:
                character = 'q';
                break;
            case PieceType.Knight:
                character = 'n';
                break;
            case PieceType.Rook:
                character = 'r';
                break;
            case PieceType.Pawn:
                character = 'p';
                break;
        }
        if (piece.color === Color.White) {
            character = character.toUpperCase();
        }
        return character;
    }

    private isOnBoard(d: Square): boolean {
        return d.file < 8 && d.file >= 0 && d.rank < 8 && d.rank >= 0;
    }

    public undoLastMove(): Move {
        // console.log(this.getPGN());
        // console.log(this.getMoveHistory());
        this.fen = this.moveHistory[this.moveHistory.length - 1].preMoveFEN;
        const firstMove = this.moveHistory[0];
        const m = this.moveHistory.pop();
        this.loadFEN();
        this.pgn = this.getPGNFromMoveHistory(firstMove.preMoveFEN);
        // console.log(this.getPGN());
        // console.log(this.getMoveHistory());
        return m;
    }

    // board object setter
    public setBoard(board: Board): void {
        this.board = board;
    }

    // updates the pieces positions in the FEN from the board state
    public updateFENPiecesPositionsFromBoard(): void {
        const boardString = this.getBoardString(this.board);
        const fenArray = this.getFEN().split(' ');
        // console.log('fenArray', fenArray);
        fenArray[0] = boardString;
        this.fen = fenArray.join(' ');
    }

    // TODO
    public getBoardString(board: Board): string {
        let boardString = '';
        for (let i = 0; i < 8; i++) {
            let empties = 0;
            for (let j = 0; j < 8; j++) {
                const piece = board.getPiece(new Square(j, 7 - i));
                if (piece) {
                    if (empties > 0) {
                        boardString += empties;
                        empties = 0;
                    }
                    boardString += this.pieceToCharSymbol(piece);
                } else {
                    empties++;
                }
            }
            if (empties > 0) {
                boardString += empties;
            }
            if (i !== 7) {
                boardString += '/';
            }
        }
        return boardString;
    }

    // SETTERS
    public setFEN(fen: string): void {
        this.fen = fen;
    }

    // GETTERS
    public getBoard(): Board {
        return this.board;
    }
    public getPiece(sq: Square): Piece {
        return this.board.getPiece(sq);
    }
    public getFEN(): string {
        return this.fen;
    }
    public getPGN(): string {
        return this.pgn;
    }
    public getPGNFromMoveHistory(fen: string): string {
        // TODO MUST REFACTOR THIS LOL
        // have to start with this fen ...
        const tempNewGame = new Game(fen);
        for (const m of this.getMoveHistory()) {
            tempNewGame.makeMove(m.notation);
        }
        return tempNewGame.getPGN();
    }
    public getTurn(): Color {
        return this.turn;
    }
    public getMoveHistory(): Move[] {
        return this.moveHistory;
    }

    public setMoveHistory(mh: Move[]): void {
        this.moveHistory = mh;
    }

    // ---

    // helper function that prints the legal moves of this game object
    public printLegalMovesToConsole(): void {
        let str = 'LEGAL MOVES';
        const legalMoves = this.getLegalMoves();
        for (const move of legalMoves) {
            move.notation = this.getNotation(move);
            str += '\n  - ' + move.notation;
        }
        console.log(str);
    }
}
