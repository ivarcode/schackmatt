/*
game.js
*/

function Game(p1, p2, gametype) {
	this.p1 = p1;
	this.p2 = p2;
	this.gametype = gametype;
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

Game.prototype.copy = function() {
	/*copies Game into a new game object and returns that object*/
	var g = new Game(this.p1,this.p2,this.gametype);
	for (var a = 0; a < 8; a++) {
		for (var b = 0; b < 8; b++) {
			console.log("copy piece "+this.get_piece({x:a,y:b}));
			g.set_piece({x:a,y:b},this.get_piece({x:a,y:b}));
		}
	}
	g.pgn = this.pgn;
	g.turn = this.turn;
	g.castling = this.castling;
	g.halfmove = this.halfmove;
	g.move_count = this.move_count;
	g.enPassant_allowedAt = this.enPassant_allowedAt;
	g.set_FEN();
	console.log("game.copy() :: successful");
	return g;
};
Game.prototype.print = function() {
	/*prints information about Game to the console*/
	console.log("print()");
	console.log("\t" + game.p1 + " vs " + game.p2);
	console.log("\t" + game.turn + " turn");
	console.log("\t" + this.get_legal_moves().length + " moves");
	var n = "\t";
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
	console.log(n);
	if (this.is_check()) {
		console.log("\t" + game.turn + " KING in check");
	} else {
		console.log("\t" + game.turn + " KING is safe");
	}
	this.print_PGN();
	if (game.enPassant_allowedAt != null) {
		console.log("\tenPassant_allowedAt " + game.enPassant_allowedAt.x + "," + game.enPassant_allowedAt.y);
	}
};
Game.prototype.print_PGN = function() {
	var out = "";
	for (var i = 0; i < this.pgn.length; i++) {
		out += this.pgn[i].notation+" ";
	}
	console.log("\tPGN :: "+out);
};
Game.prototype.change_turn = function() {
	/*changes the turn of Game*/
	this.turn = getOppColor(this.turn);
};
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
Game.prototype.add_move_to_PGN = function(move) {
	/*adds move to pgn of Game*/
	if (move.notation == null) {
		move.notation = getNotation(move,this);
	}
	this.pgn[this.pgn.length] = move;
};
Game.prototype.get_piece = function(sq) {
	/*returns the piece at sq on Game.board*/
	return this.board[sq.x][sq.y];
};
Game.prototype.is_check = function() {
	/*returns whether or not the position in game is currently check*/
	var sq = locateKing(game.turn,this);
	if (isSqThreatenedBy(sq,getOppColor(game.turn),this)) {
		console.log("CHECK");
		return true;
	}
	return false;
};
Game.prototype.is_checkmate = function() {
	/*returns whether or not the position in game is currently checkmate*/
	if (this.get_legal_moves().length == 0 && this.is_check()) {
		console.log("CHECKMATE");
		return true;
	}
	return false;
};
Game.prototype.is_stalemate = function() {
	/*returns whether or not the position in game is currently stalemate*/
	if (this.get_legal_moves().length == 0 && !this.is_check()) {
		console.log("STALEMATE");
		return true;
	}
	return false;
};
Game.prototype.game_after_move = function(move) {
	/*returns Game object after move has been made*/
	var g = game.copy();
	g.make_move(move,g.get_piece(move.src));
	return g;
};
Game.prototype.make_move_if_legal = function(move,piece) {
	/*if the move is legal, call make_move*/
	if (isLegalMove(move,this)) {
		this.make_move(move,piece);
	} else {
		console.log(".make_move_if_legal(move) :: move is not valid");
	}
};
Game.prototype.make_move = function(move,piece) {
	/*call move_piece and update the proper data in Game*/
	// castling conditions
	if (piece.type == "KING") {
		if (this.turn == "WHITE") {
			
		} else {
			
		}
	}
	// rook movement conditions
	if ((src.x == 0 && src.y == 0) || (dest.x == 0 && dest.y == 0)) {
		if (game.castling[1]) {
			game.castling[1] = false;
		}
	}
	// en passant conditions
	if (game.enPassant_allowedAt != null && dest.x == game.enPassant_allowedAt.x && dest.y == game.enPassant_allowedAt.y && game.board[src.x][src.y].type == "PAWN") {
		if (dest.x == 5) {
			game.board[4][dest.y] = nullpiece;
		} else if (dest.x == 2) {
			game.board[3][dest.y] = nullpiece;
		}
		if (game.turn == "WHITE") {
			game.board[dest.x][dest.y] = wPawn;
		} else {
			game.board[dest.x][dest.y] = bPawn;
		}
		game.board[src.x][src.y] = nullpiece;
		game.enPassant_allowedAt = null;
	} else {
		game.enPassant_allowedAt = null;
		if (game.board[src.x][src.y].type == "PAWN" && Math.abs(dest.x-src.x) == 2) {
			game.enPassant_allowedAt = {x:(src.x+dest.x)/2,y:src.y};
		}
		game.board[dest.x][dest.y] = game.board[src.x][src.y];
		game.board[src.x][src.y] = nullpiece;
	}
	

	this.add_move_to_PGN(move);
	this.move_piece(move,piece);
	this.change_turn();
	this.set_FEN();
	this.print();
};
Game.prototype.move_piece = function(move,piece) {
	/*places piece on dest and sets the src to null*/
	this.set_piece(move.dest,piece);
	this.set_piece(move.src,null);
};
Game.prototype.set_piece = function(sq,piece) {
	/*sets the sq on board equal to piece*/
	this.board[sq.x][sq.y] = piece;
};
Game.prototype.get_legal_moves = function() {
	/*returns an array of legal moves from the position in Game*/
	var moves = [];
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			try {
				if (this.board[i][j].color == this.turn) {
					var a = this.get_moves_from_sq({x:i,y:j});
					for (var b = 0; b < a.length; b++) {
						moves[moves.length] = a[b];
					}
				}
			} catch(e) {
				// console.log("ERR :: " + e.message);
			}
		}
	}
	console.log("get_legal_moves() length = "+moves.length);
	return moves;
};
Game.prototype.get_moves_from_sq = function(sq) {
	/*gets the piece on the board and calculates its possible moves
		returns an array of moves*/
	var piece = this.get_piece(sq);
	if (piece == null) {
		return [];
	}
	if (piece.type == "KING") {
		return getKingMoves(sq,piece.color,this);
	} else if (piece.type == "QUEEN") {
		return getQueenMoves(sq,piece.color,this);
	} else if (piece.type == "BISHOP") {
		return getBishopMoves(sq,piece.color,this);
	} else if (piece.type == "KNIGHT") {
		return getKnightMoves(sq,piece.color,this);
	} else if (piece.type == "ROOK") {
		return getRookMoves(sq,piece.color,this);
	} else if (piece.type == "PAWN") {
		return getPawnMoves(sq,piece.color,this);
	}
	return [];
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


