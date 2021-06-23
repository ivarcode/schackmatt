import { Board } from './board.library';
import { Square } from './square.library';
import { Color } from './util.library';

export interface Branch {
    definingMove: string;
    fen: string;
    classification: string;
    explanation: string;
    options: Branch[];
    // only bein used for tracking the number of checks
    ticks?: number;
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

export interface GameConfig {
    maxSquareDimensions: number;
    restrictPieces: Color[];
    orientation: Color;
    showCoordinates: boolean;
    colorScheme: {
        light: string;
        dark: string;
    };
}

export interface CastlingRights {
    K: boolean;
    Q: boolean;
    k: boolean;
    q: boolean;
}

export interface LichessStudy {
    Event: string;
    Site: string;
    Result: string;
    UTCDate: string;
    UTCTime: string;
    Variant: string;
    ECO: string;
    Opening: string;
    Annotator: string;
    FEN?: string;
    SetUp?: string;
    pgnContent: string;
}

export interface LichessGame {
    Event: string;
    Site: string;
    Date: string;
    White: string;
    Black: string;
    Result: string;
    UTCDate: string;
    UTCTime: string;
    WhiteElo: string;
    BlackElo: string;
    WhiteRatingDiff: string;
    BlackRatingDiff: string;
    Variant: string;
    TimeControl: string;
    ECO: string;
    Termination: string;
    pgnContent: string;
}

export interface LineNode {
    move: string;
    nextNodes: LineNode[];
    // documentation not comment? idk
    comment: string[];
    // NEEDS a better name
    draws: string;
}

export interface Puzzle {
    FEN: string;
    pgn: LineNode;
    // if present, line begins at a specific LineNode
    beginAt?: LineNode;
    title: string;
}
