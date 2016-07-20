/*
game.js
*/

/*Game object constructor
	used as the object to store all the data associated with a created 'game' of chess*/
function Game(p1, p2, gametype, pos, pgn) {
	this.p1 = p1;
	this.p2 = p2;
	this.gametype = gametype;
	this.fen = pos;
	this.board_from_FEN = function() {
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
			console.log(this.get_FEN().charAt(i));
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
				i++;
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
	this.board = this.board_from_FEN();
	this.pgn = pgn;
}
/*Move object constructor
	used as the object to store all the data associated with a 'move' calculation i.e. src, dest, piece*/
function Move(src, dest, piece) {
	this.src = src;
	this.dest = dest;
	this.piece = piece;
}
/*Piece object constructor
	used as the object to store all the data associated with a 'piece' i.e. type, color*/
function Piece(type, color) {
	this.type = type;
	this.color = color;
}

/*Game object prototype methods
	all methods used to manipulate or access data from game, each is given a brief description*/
Game.prototype.get_players = function() {
	/*returns an object {p1,p2} which returns the respective players in Game*/
	return {p1:this.p1,p2:this.p2};
};
Game.prototype.get_turn = function() {
	/*returns the turn of game in the form of a string "WHITE" or "BLACK"*/
	var i = 0;
	while (this.get_FEN().charAt(i) != ' ') {
		i++;
	}
	var turn = this.get_FEN().charAt(i+1);
	// console.log("turn = "+turn);
	if (turn == 'w') {
		return "WHITE";
	} else if (turn == 'b') {
		return "BLACK";
	}
	return "ERR: invalid color in FEN";
};
Game.prototype.get_FEN = function() {
	/*returns the FEN string of the Game*/
	return this.fen;
};
Game.prototype.set_piece = function(sq,piece) {
	/*sets the sq on board equal to piece*/
	this.board[sq.x][sq.y] = piece;
};
Game.prototype.print = function(print_board) {
	/*prints information about Game to the console and prints out char based board graphic if print_board == true*/
	console.log("print("+print_board+")");
	console.log("\t" + this.p1 + " vs " + this.p2);
	console.log("\t" + this.get_turn() + " turn");
	// console.log("\t" + this.get_legal_moves().length + " moves");
	// var n = "\t";
	// if (game.castling[0]) {
	// 	n += "K";
	// }
	// if (game.castling[1]) {
	// 	n += "Q";
	// }
	// if (game.castling[2]) {
	// 	n += "k";
	// }
	// if (game.castling[3]) {
	// 	n += "q";
	// }
	// console.log(n);
	// if (this.is_check()) {
	// 	console.log("\t" + game.turn + " KING in check");
	// } else {
	// 	console.log("\t" + game.turn + " KING is safe");
	// }
	// this.print_PGN();
	// if (game.enPassant_allowedAt != null) {
	// 	console.log("\tenPassant_allowedAt " + game.enPassant_allowedAt.x + "," + game.enPassant_allowedAt.y);
	// }
	// if (print_board) {
	// 	var s = "";
	// 	for (var a = 7; a > -1; a--) {
	// 		s += "\t";
	// 		for (var b = 0; b < 8; b++) {
	// 			try {
	// 				if (this.get_piece({x:a,y:b}).color == "WHITE") {
	// 					if (this.get_piece({x:a,y:b}).type == "KING") {
	// 						s += "K";
	// 					} else if (this.get_piece({x:a,y:b}).type == "QUEEN") {
	// 						s += "Q";
	// 					} else if (this.get_piece({x:a,y:b}).type == "BISHOP") {
	// 						s += "B";
	// 					} else if (this.get_piece({x:a,y:b}).type == "KNIGHT") {
	// 						s += "N";
	// 					} else if (this.get_piece({x:a,y:b}).type == "ROOK") {
	// 						s += "R";
	// 					} else if (this.get_piece({x:a,y:b}).type == "PAWN") {
	// 						s += "P";
	// 					}
	// 				} else {
	// 					if (this.get_piece({x:a,y:b}).type == "KING") {
	// 						s += "k";
	// 					} else if (this.get_piece({x:a,y:b}).type == "QUEEN") {
	// 						s += "q";
	// 					} else if (this.get_piece({x:a,y:b}).type == "BISHOP") {
	// 						s += "b";
	// 					} else if (this.get_piece({x:a,y:b}).type == "KNIGHT") {
	// 						s += "n";
	// 					} else if (this.get_piece({x:a,y:b}).type == "ROOK") {
	// 						s += "r";
	// 					} else if (this.get_piece({x:a,y:b}).type == "PAWN") {
	// 						s += "p";
	// 					}
	// 				}
	// 			} catch(e) {
	// 				s += " ";
	// 				// console.log(e.message);
	// 			}
	// 		}
	// 		s += "\n";
	// 	}
	// 	console.log(s);
	// }
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