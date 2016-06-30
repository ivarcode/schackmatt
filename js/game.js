/*
game.js
*/

function Game(p1, p2, gametype) {
	this.p1 = p1;
	this.p2 = p2;
	if (gametype == "STANDARD") {
		this.board = BOARD_STANDARD;
		this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	} else if (gametype == "TEST") {
		this.board = BOARD_TEST;
	}
	this.turn = "WHITE";
	this.pgn = [];
	this.castling = [];
	for (var i = 0; i < 4; i++) {
		this.castling[i] = true;
	}
	this.halfmove = 0;
	this.move_count = 1;
	this.enPassant_allowedAt = null;
}

function Move(src, dest, notation) {
	this.src = src;
	this.dest = dest;
	this.notation = notation;
}

function Piece(type, color) {
	this.type = type;
	this.color = color;
}

Game.prototype.get_players = function() {
	/*returns an object {p1,p2} which returns the respective players in Game*/
	return {p1:this.p1,p2:this.p2};
};
Game.prototype.get_FEN = function() {
	/*returns the FEN string of the Game*/
	return this.fen;
};
Game.prototype.set_FEN = function() {
	/*sets the fen property of Game to refect the current state of Game*/
	var newFEN = "";
	var inc = 0;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (game.board[7-i][j] == null) {
				inc++;
			} else {
				if (inc > 0) {
					newFEN += inc;
					inc = 0;
				}
				if (game.board[7-i][j].color == "WHITE") {
					if (game.board[7-i][j].type == "KING") {
						newFEN += "K";
					} else if (game.board[7-i][j].type == "QUEEN") {
						newFEN += "Q";
					} else if (game.board[7-i][j].type == "BISHOP") {
						newFEN += "B";
					} else if (game.board[7-i][j].type == "KNIGHT") {
						newFEN += "N";
					} else if (game.board[7-i][j].type == "ROOK") {
						newFEN += "R";
					} else if (game.board[7-i][j].type == "PAWN") {
						newFEN += "P";
					}
				} else {
					if (game.board[7-i][j].type == "KING") {
						newFEN += "k";
					} else if (game.board[7-i][j].type == "QUEEN") {
						newFEN += "q";
					} else if (game.board[7-i][j].type == "BISHOP") {
						newFEN += "b";
					} else if (game.board[7-i][j].type == "KNIGHT") {
						newFEN += "n";
					} else if (game.board[7-i][j].type == "ROOK") {
						newFEN += "r";
					} else if (game.board[7-i][j].type == "PAWN") {
						newFEN += "p";
					}
				}
			}
		}
		if (inc > 0) {
			newFEN += inc;
			inc = 0;
		}
		if (i != 7) {
			newFEN += "/";
		}
	}
	newFEN += " ";
	if (game.turn == "WHITE") {
		newFEN += "w";
	} else {
		newFEN += "b";
	}
	newFEN += " ";
	if (game.castling[0]) {
		newFEN += "K";
	}
	if (game.castling[1]) {
		newFEN += "Q";
	}
	if (game.castling[2]) {
		newFEN += "k";
	}
	if (game.castling[3]) {
		newFEN += "q";
	} else {
		if (!game.castling[0] && !game.castling[1] && !game.castling[2] && !game.castling[3]) {
			newFEN += "-";
		}
	}
	newFEN += " ";
	if (game.enPassant_allowedAt != null) {
		newFEN += pairToSq(game.enPassant_allowedAt);
	} else {
		newFEN += "-";
	}
	newFEN += " ";
	newFEN += game.halfmove;
	newFEN += " ";
	newFEN += game.move_count;

	game.fen = newFEN;
	document.getElementById('FEN').innerHTML = game.fen;
};
Game.prototype.get_PGN = function() {
	/*returns the PGN [] of the Game*/
	return this.pgn;
};
Game.prototype.make_move = function(src, dest, piece) {
	/*if the move is legal, make it and update the proper data in Game*/
	
};


var wPawn = new Piece("PAWN", "WHITE");
var wKnight = new Piece("KNIGHT", "WHITE");
var wBishop = new Piece("BISHOP", "WHITE");
var wRook = new Piece("ROOK", "WHITE");
var wQueen = new Piece("QUEEN", "WHITE");
var wKing = new Piece("KING", "WHITE");
var bPawn = new Piece("PAWN", "BLACK");
var bKnight = new Piece("KNIGHT", "BLACK");
var bBishop = new Piece("BISHOP", "BLACK");
var bRook = new Piece("ROOK", "BLACK");
var bQueen = new Piece("QUEEN", "BLACK");
var bKing = new Piece("KING", "BLACK");


var BOARD_STANDARD = [
[wRook,wKnight,wBishop,wQueen,wKing,wBishop,wKnight,wRook],
[wPawn,wPawn,wPawn,wPawn,wPawn,wPawn,wPawn,wPawn],
[null,null,null,null,null,null,null,null],
[null,null,null,null,null,null,null,null],
[null,null,null,null,null,null,null,null],
[null,null,null,null,null,null,null,null],
[bPawn,bPawn,bPawn,bPawn,bPawn,bPawn,bPawn,bPawn],
[bRook,bKnight,bBishop,bQueen,bKing,bBishop,bKnight,bRook]
];

var BOARD_TEST = [
[wKing,null,null,null,null,null,null,null],
[null,null,null,null,null,null,null,null],
[null,null,null,null,null,null,null,null],
[null,null,null,null,null,null,null,null],
[null,wPawn,null,null,null,null,null,null],
[null,null,null,null,null,null,null,null],
[null,null,null,null,null,null,null,null],
[bKing,null,null,null,null,null,null,null]
];


