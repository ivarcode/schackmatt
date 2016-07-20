/*
game.js
*/

function Game(p1, p2, gametype, pos, pgn) {
	this.p1 = p1;
	this.p2 = p2;
	this.gametype = gametype;
	this.fen = pos;
	this.board = board_from_FEN();
	this.pgn = pgn;
}

Game.prototype.get_players = function() {
	/*returns an object {p1,p2} which returns the respective players in Game*/
	return {p1:this.p1,p2:this.p2};
};
Game.prototype.board_from_FEN = function() {
	/*sets the board array of the Game object to mirror the FEN*/
	var board = [
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null]
	];
	var i = 0;
	var a = 7;
	var b = 0;
	var n = 1;
	while (true) {
		if (this.get_FEN().charAt(i) == 'k') {
			board[a][b] = bKing;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == 'q') {
			board[a][b] = bQueen;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == 'b') {
			board[a][b] = bBishop;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == 'n') {
			board[a][b] = bKnight;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == 'r') {
			board[a][b] = bRook;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == 'p') {
			board[a][b] = bPawn;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == 'K') {
			board[a][b] = wKing;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == 'Q') {
			board[a][b] = wQueen;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == 'B') {
			board[a][b] = wBishop;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == 'N') {
			board[a][b] = wKnight;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == 'R') {
			board[a][b] = wRook;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == 'P') {
			board[a][b] = wPawn;
			i++;
			b++;
		} else if (this.get_FEN().charAt(i) == '/') {
			a--;
			b = 0;
		} else if (this.get_FEN().charAt(i) == ' ') {
			break;
		} else {
			if (n == parseInt(this.get_FEN().charAt(i))) {
				board[a][b] = null;
				b++;
				n = 1;
				i++;
			} else {
				board[a][b] = null;
				b++;
				n++;
			}
		}
	}
	return board;
};
Game.prototype.set_piece = function(sq,piece) {
	/*sets the sq on board equal to piece*/
	this.board[sq.x][sq.y] = piece;
};
Game.prototype.get_FEN = function() {
	/*returns the FEN string of the Game*/
	return this.fen;
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