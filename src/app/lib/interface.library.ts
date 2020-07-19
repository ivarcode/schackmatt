import { Board, Square } from './game.library';

export interface Branch {
    definingMove: string;
    fen: string;
    classification: string;
    explanation: string;
    options: Branch[];
}

export interface Move {
    src: Square;
    dest: Square;
    preMoveFEN: string;
    resultingBoard: Board;
    notation: string;
}

export interface GameEvent {
    type: string;
    content: string;
}
