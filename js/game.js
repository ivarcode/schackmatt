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
	// console.log("this.fen = "+this.fen);
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
			// console.log(this.get_FEN().charAt(i));
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
					b++; n++;
				}
			}
		}
		return board;
	};
	this.board = this.board_from_FEN();
	this.pgn = pgn;
	this.turn = null;
	this.castling = [];
	this.halfmove = null;
	this.move_count = null;
	this.enPassant_allowedAt = null;
	this.load_data_from_FEN = function() {
		/*skips board and loads other data to game*/
		var i = 0;
		while (this.get_FEN().charAt(i) != ' ') {
			i++;
		}
		i++;
		if (this.get_FEN().charAt(i) == 'w') {
			this.turn = "WHITE";
		} else if (this.get_FEN().charAt(i) == 'b') {
			this.turn = "BLACK";
		} else {
			console.log("charAt(i) = "+this.get_FEN().charAt(i));
			throw "ERR :: invalid color";
		}
		i+=2;
		if (this.get_FEN().charAt(i++) == "K") {
			this.castling[0] = true; }
		if (this.get_FEN().charAt(i++) == "Q") {
			this.castling[1] = true; }
		if (this.get_FEN().charAt(i++) == "k") {
			this.castling[2] = true; }
		if (this.get_FEN().charAt(i++) == "q") {
			this.castling[3] = true; }
		i++;
		if (this.get_FEN().charAt(i) == '-') {
			if (this.enPassant_allowedAt)
				this.enPassant_allowedAt = null;
		} else {
			this.enPassant_allowedAt = this.get_FEN().charAt(i);
		}
		i+=2;
		this.halfmove = this.get_FEN().charAt(i);
		i+=2;
		this.move_count = this.get_FEN().charAt(i);
	};
	this.load_data_from_FEN();
}
/*Piece object constructor
	used as the object to store all the data associated with a 'piece' i.e. type, color*/
function Piece(type, color) {
	this.type = type;
	this.color = color;
}



/*Game prototype getters*/
Game.prototype.get_FEN = function() {
	/*returns the FEN string of the Game*/
	return this.fen;
};
Game.prototype.get_king = function(color) {
	/*finds the king of color in game*/
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (game.get_piece({x:i,y:j}) != null && game.get_piece({x:i,y:j}).type == "KING" && game.get_piece({x:i,y:j}).color == color) {
				// console.log("\t\t"+i+" "+j);
				// console.log("\t\tget_king() :: "+color+" king found on board");
				return {x:i,y:j};
			}
		}
	}
	// console.log("\t\tget_king() :: no "+color+" king found on board");
	return null;
};
Game.prototype.get_legal_moves = function() {
	/*returns an array of legal moves from the position in Game*/
	// console.log('get legal moves function happens');
	var moves = [];
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			try {
				// console.log("trying");
				if (this.get_piece({x:i,y:j}) != null && this.get_piece({x:i,y:j}).color == this.get_turn()) {
					// console.log('kek');
					var a = this.get_moves_from_sq({x:i,y:j});
					console.log(a);
					console.log("testing for moves from sq "+i+","+j);
					for (var b = 0; b < a.length; b++) {
						moves[moves.length] = a[b];
					}
				}
			} catch(e) {
				console.log("ERR :: " + e.message);
			}
		}
	}
	// console.log("\tget_legal_moves() length = "+moves.length);
	for (var a = 0; a < moves.length; a++) {
		var g = this.game_after_move(moves[a]);
		// g.print();
		if (g.is_check(game.turn)) {
			moves.remove(a);
			a--;
		}
	}
	
	for (var d = 0; d < moves.length; d++) {
		moves[d].print();
	}
	return moves;
};
Game.prototype.get_opp_color = function(color) {
	/*returns the color that is not the input color, white -> black, black -> white*/
	if (color == "WHITE") {
		return "BLACK";
	} else if (color == "BLACK") {
		return "WHITE";
	} else {
		throw "ERR :: invalid color";
	}
};
Game.prototype.get_piece = function(sq) {
	/*returns the piece at sq on Game.board*/
	return this.board[sq.x][sq.y];
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




Game.prototype.is_check = function(color) {
	/*returns whether or not the position in game is currently check*/
	var sq = this.get_king(color);
	console.log(sq);
	console.log(color);
	if (this.is_sq_threatened_by(sq,this.get_opp_color(color))) {
		console.log("CHECK");
		return true;
	}
	return false;
};




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
	}
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