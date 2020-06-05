import { Board, Square } from './game.library';

export interface Branch {
    definingMove: string;
    fen: string;
    options: Branch[];
}

export interface Move {
    src: Square;
    dest: Square;
    preMoveFEN: string;
    resultingBoard: Board;
    notation: string;
}
