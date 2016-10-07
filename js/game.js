/*
game.js
*/

/*Game object constructor
used as the object to store all the data associated with a created 'game' of chess*/
function Game(p1, p2, gametype, pos, pgn) {
	// console.log("Creating game object...");
	this.p1 = p1;
	this.p2 = p2;
	this.gametype = gametype;
	this.fen = pos;
	this.pgn = pgn;
}
/*Piece object constructor
used as the object to store all the data associated with a 'piece' i.e. type, color*/
function Piece(type, color) {
	this.type = type;
	this.color = color;
}
/*Move object constructor
used as the object to store all the data associated with a 'move' calculation i.e. src, dest, piece*/
function Move(src, dest, piece) {
	this.src = src;
	this.dest = dest;
	this.piece = piece;
}


/*Game prototype getters*/
Game.prototype.get_FEN = function() {
	/*returns the FEN string (position) of the Game*/
	return this.fen;
};
Game.prototype.get_turn = function() {
	/*returns the turn of game in the form of a string "WHITE" or "BLACK"*/
	var i = 0;
	while (this.get_FEN().charAt(i) != ' ') {
		i++;
	}
	var t = this.get_FEN().charAt(i+1);
	// console.log("turn = "+turn);
	if (t == 'w') {
		// console.log("get_turn WHITE");
		return "WHITE";
	} else if (t == 'b') {
		// console.log("get_turn BLACK");
		return "BLACK";
	}
	return "ERR: invalid color in FEN";
};



function function_name(argument) {
	// body...
}


Game.prototype.print = function(print_board) {
	/*prints information about Game to the console and prints out char based board graphic if print_board == true*/
	console.log("Game.prototype.print("+print_board+")");
	console.log("\t" + this.p1 + " vs " + this.p2);
	console.log("\t" + this.get_turn() + " turn");
	console.log("\t" + this.get_legal_moves().length + " moves");
	var n = "";
	if (game.castling[0]) {
		n += "K";
	}
	if (game.castling[1]) {
		n += "Q";
	}
	if (game.castling[2]) {
		n += "k";
	}
	if (game.castling[3]) {
		n += "q";
	}
	console.log("\tcastling availability :: "+n);
	// if (this.is_check(game.turn)) {
	// 	console.log("\t" + game.turn + " KING in check");
	// } else {
	// 	console.log("\t" + game.turn + " KING is safe");
	// }
	this.print_PGN();
	if (game.enPassant_allowedAt != null) {
		console.log("\tenPassant legal at " + game.enPassant_allowedAt.x + "," + game.enPassant_allowedAt.y);
	} else {
		console.log("\tenPassant not legal");
	}
	console.log("\tcurrent FEN = "+this.get_FEN());
	if (print_board) {
		this.print_Pos();
	}
};
Game.prototype.print_Pos = function() {
	var s = "";
	for (var a = 7; a > -1; a--) {
		s += "\t";
		for (var b = 0; b < 8; b++) {
			try {
				if (this.get_piece({x:a,y:b}).color == "WHITE") {
					if (this.get_piece({x:a,y:b}).type == "KING") {
						s += "K";
					} else if (this.get_piece({x:a,y:b}).type == "QUEEN") {
						s += "Q";
					} else if (this.get_piece({x:a,y:b}).type == "BISHOP") {
						s += "B";
					} else if (this.get_piece({x:a,y:b}).type == "KNIGHT") {
						s += "N";
					} else if (this.get_piece({x:a,y:b}).type == "ROOK") {
						s += "R";
					} else if (this.get_piece({x:a,y:b}).type == "PAWN") {
						s += "P";
					}
				} else {
					if (this.get_piece({x:a,y:b}).type == "KING") {
						s += "k";
					} else if (this.get_piece({x:a,y:b}).type == "QUEEN") {
						s += "q";
					} else if (this.get_piece({x:a,y:b}).type == "BISHOP") {
						s += "b";
					} else if (this.get_piece({x:a,y:b}).type == "KNIGHT") {
						s += "n";
					} else if (this.get_piece({x:a,y:b}).type == "ROOK") {
						s += "r";
					} else if (this.get_piece({x:a,y:b}).type == "PAWN") {
						s += "p";
					}
				}
			} catch(e) {
				s += " ";
				// console.log(e.message);
			}
		}
		s += "\n";
	}
	console.log(s);
};
Game.prototype.print_PGN = function() {
	var out = "";
	for (var i = 0; i < this.pgn.length; i++) {
		out += this.pgn[i].notation+" ";
	}
	console.log("\tPGN :: "+out);
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


/*var BOARD_STANDARD = [
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
];*/