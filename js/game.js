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
Game.prototype.get_legal_positions = function() {
	/*returns an array of legal positions that are the result of the next possible legal moves in the position in Game*/
	var positions = [];
	var board = board_from_FEN(this.get_FEN());
	print_board(board);
	// loop through board to find all pieces of the same color as Game.get_turn
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			try {
				var piece = board[i][j];
				if (piece.color == this.get_turn()) {
					console.log("checking moves for piece \""+piece.color+" "+piece.type+"\" at "+i+","+j);
					var a = get_positions_after_moves_from_sq(board,{x:i,y:j});
					console.log(a);
				}
			} catch(e) {
				// console.log(e.message);
			}
		}
	}


	return positions;
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


/*Helper functions*/
function board_from_FEN(fen) {
	/*returns a board (an array containing pieces) that results from the parameter fen*/
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
		if (fen.charAt(i) == 'k') {
			board[a][b] = bKing;
			i++;
			b++;
		} else if (fen.charAt(i) == 'q') {
			board[a][b] = bQueen;
			i++;
			b++;
		} else if (fen.charAt(i) == 'b') {
			board[a][b] = bBishop;
			i++;
			b++;
		} else if (fen.charAt(i) == 'n') {
			board[a][b] = bKnight;
			i++;
			b++;
		} else if (fen.charAt(i) == 'r') {
			board[a][b] = bRook;
			i++;
			b++;
		} else if (fen.charAt(i) == 'p') {
			board[a][b] = bPawn;
			i++;
			b++;
		} else if (fen.charAt(i) == 'K') {
			board[a][b] = wKing;
			i++;
			b++;
		} else if (fen.charAt(i) == 'Q') {
			board[a][b] = wQueen;
			i++;
			b++;
		} else if (fen.charAt(i) == 'B') {
			board[a][b] = wBishop;
			i++;
			b++;
		} else if (fen.charAt(i) == 'N') {
			board[a][b] = wKnight;
			i++;
			b++;
		} else if (fen.charAt(i) == 'R') {
			board[a][b] = wRook;
			i++;
			b++;
		} else if (fen.charAt(i) == 'P') {
			board[a][b] = wPawn;
			i++;
			b++;
		} else if (fen.charAt(i) == '/') {
			a--;
			i++;
			b = 0;
		} else if (fen.charAt(i) == ' ') {
			break;
		} else {
			if (n == parseInt(fen.charAt(i))) {
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
}
function get_diagonals_from_sq(board,sq) {
	/*returns an array of sqs on a legal diagonal from sq on board*/
	var source_piece_color = board[sq.x][sq.y].color;
	var list = [];
	var a = sq.x;
	var b = sq.y;
	while (a+1 < 8 && b+1 < 8) {
		a++;
		b++;
		if (board[a][b] != null) {
			if (board[a][b].color == source_piece_color) {
				break;
			} else {
				list[list.length] = {x:a,y:b};
				break;
			}
		} else {
			list[list.length] = {x:a,y:b};
		}
	}
	a = sq.x;
	b = sq.y;
	while (a-1 > -1 && b+1 < 8) {
		a--;
		b++;
		if (board[a][b] != null) {
			if (board[a][b].color == source_piece_color) {
				break;
			} else {
				list[list.length] = {x:a,y:b};
				break;
			}
		} else {
			list[list.length] = {x:a,y:b};
		}
	}
	a = sq.x;
	b = sq.y;
	while (a+1 < 8 && b-1 > -1) {
		a++;
		b--;
		if (board[a][b] != null) {
			if (board[a][b].color == source_piece_color) {
				break;
			} else {
				list[list.length] = {x:a,y:b};
				break;
			}
		} else {
			list[list.length] = {x:a,y:b};
		}
	}
	a = sq.x;
	b = sq.y;
	while (a-1 > -1 && b-1 > -1) {
		a--;
		b--;
		if (board[a][b] != null) {
			if (board[a][b].color == source_piece_color) {
				break;
			} else {
				list[list.length] = {x:a,y:b};
				break;
			}
		} else {
			list[list.length] = {x:a,y:b};
		}
	}
	return list;
}
function get_flats_from_sq(board,sq) {
	/*returns an array of sqs on a legal diagonal from sq on board*/
	var source_piece_color = board[sq.x][sq.y].color;
	var list = [];
	var a = sq.x;
	var b = sq.y;
	while (a+1 < 8) {
		a++;
		if (board[a][b] != null) {
			if (board[a][b].color == source_piece_color) {
				break;
			} else {
				list[list.length] = {x:a,y:b};
				break;
			}
		} else {
			list[list.length] = {x:a,y:b};
		}
	}
	a = sq.x;
	while (a-1 > -1) {
		a--;
		if (board[a][b] != null) {
			if (board[a][b].color == source_piece_color) {
				break;
			} else {
				list[list.length] = {x:a,y:b};
				break;
			}
		} else {
			list[list.length] = {x:a,y:b};
		}
	}
	a = sq.x;
	while (b+1 < 8) {
		b++;
		if (board[a][b] != null) {
			if (board[a][b].color == source_piece_color) {
				break;
			} else {
				list[list.length] = {x:a,y:b};
				break;
			}
		} else {
			list[list.length] = {x:a,y:b};
		}
	}
	b = sq.y;
	while (b-1 > -1) {
		b--;
		if (board[a][b] != null) {
			if (board[a][b].color == source_piece_color) {
				break;
			} else {
				list[list.length] = {x:a,y:b};
				break;
			}
		} else {
			list[list.length] = {x:a,y:b};
		}
	}
	return list;
}
function get_positions_after_moves_from_sq(board,sq) {
	/*returns an array of positions following the legal moves from the sq in board, on board*/
	var source_piece_color = board[sq.x][sq.y].color;
	var list = [];
	try {
		if (board[sq.x][sq.y].type == "KING") {
			list[list.length] = {x:sq.x+1,y:sq.y};
			list[list.length] = {x:sq.x+1,y:sq.y+1};
			list[list.length] = {x:sq.x+1,y:sq.y-1};
			list[list.length] = {x:sq.x-1,y:sq.y};
			list[list.length] = {x:sq.x-1,y:sq.y+1};
			list[list.length] = {x:sq.x-1,y:sq.y-1};
			list[list.length] = {x:sq.x,y:sq.y+1};
			list[list.length] = {x:sq.x,y:sq.y-1};
		} else if (board[sq.x][sq.y].type == "QUEEN") {
			var diagonals = get_diagonals_from_sq(board,sq);
			for (var n = 0; n < diagonals.length; n++) {
				list[list.length] = diagonals[n];
			}
			var flats = get_flats_from_sq(board,sq);
			for (var n = 0; n < flats.length; n++) {
				list[list.length] = flats[n];
			}
		} else if (board[sq.x][sq.y].type == "BISHOP") {
			var diagonals = get_diagonals_from_sq(board,sq);
			for (var n = 0; n < diagonals.length; n++) {
				list[list.length] = diagonals[n];
			}
		} else if (board[sq.x][sq.y].type == "KNIGHT") {
			list[list.length] = {x:sq.x+1,y:sq.y+2};
			list[list.length] = {x:sq.x+1,y:sq.y-2};
			list[list.length] = {x:sq.x+2,y:sq.y+1};
			list[list.length] = {x:sq.x+2,y:sq.y-1};
			list[list.length] = {x:sq.x-1,y:sq.y+2};
			list[list.length] = {x:sq.x-1,y:sq.y-2};
			list[list.length] = {x:sq.x-2,y:sq.y+1};
			list[list.length] = {x:sq.x-2,y:sq.y-1};
		} else if (board[sq.x][sq.y].type == "ROOK") {
			var flats = get_flats_from_sq(board,sq);
			for (var n = 0; n < flats.length; n++) {
				list[list.length] = flats[n];
			}
		} else if (board[sq.x][sq.y].type == "PAWN") {

		}
		// console.log("list length = "+list.length);
		for (var i = 0; i < list.length; i++) {
			if (list[i].x < 0 || list[i].x > 7 || list[i].y < 0 || list[i].y > 7) {
				console.log("index out of bounds, deleting sq "+list[i].x+","+list[i].y);
				list.splice(i,1);
				i--;
			}
		}
		// console.log("list length = "+list.length);
		for (var i = 0; i < list.length; i++) {
			// console.log("friendly piece check for "+list[i].x+","+list[i].y);
			if (board[list[i].x][list[i].y] != null) {
				if (board[list[i].x][list[i].y].color == source_piece_color) {
					console.log("sq occupied by friendly, deleting sq "+list[i].x+","+list[i].y);
					list.splice(i,1);
					i--;
				}
			}
		}
		console.log("list length = "+list.length);
	} catch(e) {
		console.log(e.message);
	}
	return list;
}
function print_board(board) {
	/*prints board in the console for debugging*/
	var s = " ________ \n";
	for (var a = 7; a > -1; a--) {
		s += "|";
		for (var b = 0; b < 8; b++) {
			try {
				if (board[a][b].color == "WHITE") {
					if (board[a][b].type == "KING") {
						s += "K";
					} else if (board[a][b].type == "QUEEN") {
						s += "Q";
					} else if (board[a][b].type == "BISHOP") {
						s += "B";
					} else if (board[a][b].type == "KNIGHT") {
						s += "N";
					} else if (board[a][b].type == "ROOK") {
						s += "R";
					} else if (board[a][b].type == "PAWN") {
						s += "P";
					}
				} else if (board[a][b].color == "BLACK") {
					if (board[a][b].type == "KING") {
						s += "k";
					} else if (board[a][b].type == "QUEEN") {
						s += "q";
					} else if (board[a][b].type == "BISHOP") {
						s += "b";
					} else if (board[a][b].type == "KNIGHT") {
						s += "n";
					} else if (board[a][b].type == "ROOK") {
						s += "r";
					} else if (board[a][b].type == "PAWN") {
						s += "p";
					}
				}
			} catch(e) {
				s += " ";
				// console.log(e.message);
			}
		}
		s += "|\n";
	}
	s += " -------- ";
	console.log(s);
}


Game.prototype.print = function(print_position) {
	/*prints information about Game to the console and prints out char based board graphic if print_position == true*/
	console.log("Game.prototype.print("+print_position+")");
	console.log("\t" + this.p1 + " vs " + this.p2);
	console.log("\tturn = \"" + this.get_turn()+"\"");
	console.log("\tcurrent pos = \""+this.get_FEN()+"\"");
	console.log("\t" + this.get_legal_positions().length + " moves");
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
	if (print_position) {
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