/*
game.js
*/

function Game(p1, p2, gametype) {
	this.p1 = p1;
	this.p2 = p2;
	this.gametype = gametype;
	this.fen = null;
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

function Move(src, dest, piece) {
	this.src = src;
	this.dest = dest;
	this.piece = piece;
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
Game.prototype.print = function(print_board) {
	/*prints information about Game to the console and prints out char based board graphic if print_board == true*/
	console.log("print("+print_board+")");
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
			if (this.board[7-i][j] == null) {
				inc++;
			} else {
				if (inc > 0) {
					newFEN += inc;
					inc = 0;
				}
				if (this.board[7-i][j].color == "WHITE") {
					if (this.board[7-i][j].type == "KING") {
						newFEN += "K";
					} else if (this.board[7-i][j].type == "QUEEN") {
						newFEN += "Q";
					} else if (this.board[7-i][j].type == "BISHOP") {
						newFEN += "B";
					} else if (this.board[7-i][j].type == "KNIGHT") {
						newFEN += "N";
					} else if (this.board[7-i][j].type == "ROOK") {
						newFEN += "R";
					} else if (this.board[7-i][j].type == "PAWN") {
						newFEN += "P";
					}
				} else {
					if (this.board[7-i][j].type == "KING") {
						newFEN += "k";
					} else if (this.board[7-i][j].type == "QUEEN") {
						newFEN += "q";
					} else if (this.board[7-i][j].type == "BISHOP") {
						newFEN += "b";
					} else if (this.board[7-i][j].type == "KNIGHT") {
						newFEN += "n";
					} else if (this.board[7-i][j].type == "ROOK") {
						newFEN += "r";
					} else if (this.board[7-i][j].type == "PAWN") {
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
	if (this.turn == "WHITE") {
		newFEN += "w";
	} else {
		newFEN += "b";
	}
	newFEN += " ";
	if (this.castling[0]) {
		newFEN += "K";
	}
	if (this.castling[1]) {
		newFEN += "Q";
	}
	if (this.castling[2]) {
		newFEN += "k";
	}
	if (this.castling[3]) {
		newFEN += "q";
	} else {
		if (!this.castling[0] && !this.castling[1] && !this.castling[2] && !this.castling[3]) {
			newFEN += "-";
		}
	}
	newFEN += " ";
	if (this.enPassant_allowedAt != null) {
		newFEN += pairToSq(this.enPassant_allowedAt);
	} else {
		newFEN += "-";
	}
	newFEN += " ";
	newFEN += this.halfmove;
	newFEN += " ";
	newFEN += this.move_count;

	this.fen = newFEN;
};
Game.prototype.get_PGN = function() {
	/*returns the PGN [] of the Game*/
	return this.pgn;
};
Game.prototype.add_move_to_PGN = function(move) {
	/*adds move to pgn of Game*/
	
	this.pgn[this.pgn.length] = move;
};
Game.prototype.get_piece = function(sq) {
	/*returns the piece at sq on Game.board*/
	return this.board[sq.x][sq.y];
};
Game.prototype.is_check = function(color) {
	/*returns whether or not the position in game is currently check*/
	var sq = locateKing(color,this);
	if (this.isSqThreatenedBy(sq,getOppColor(color,this))) {
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
	g.make_move(move,g.get_piece(move.src),true);
	return g;
};
Game.prototype.make_move = function(move,force_move) {
	/*attempts to make move of piece but checks move legality first*/
	if (force_move || isLegalMove(move,this)) {
		// console.log("moving piece "+move.piece.color+" "+move.piece.type);
		// move.print();
		this.add_move_to_PGN(move);
		this.move_piece(move);
		this.change_turn();
	} else {
		console.log(".make_move :: move is not valid");
	}
	// this.set_FEN();
	// this.print();
};
Game.prototype.move_piece = function(move) {
	/*places piece on dest and sets the src to null*/
	this.set_piece(move.dest,move.piece);
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
	// console.log("get_legal_moves() length = "+moves.length);
	for (var a = 0; a < moves.length; a++) {
		var g = this.game_after_move(moves[a]);
		if (g.is_check(game.turn)) {
			moves.remove(a);
			a--;
		}
	}
	return moves;
};
Game.prototype.isSqThreatenedBy = function(sq,color) {
	/*returns a boolean if the sq on Game is threatened by color*/
	var moves = [];
	var c = getOppColor(color);
	moves = this.getKnightMoves(sq,c);
	for (var i = 0; i < moves.length; i++) {
		if (game.board[moves[i].dest.x][moves[i].dest.y] != null && game.board[moves[i].dest.x][moves[i].dest.y].type == "KNIGHT" && game.board[moves[i].dest.x][moves[i].dest.y].color == color) {
			console.log("knight threatens "+color+" king");
			return true;
		}
	}
	moves = this.getBishopMoves(sq,c);
	for (var i = 0; i < moves.length; i++) {
		if (this.board[moves[i].dest.x][moves[i].dest.y] != null && ((this.board[moves[i].dest.x][moves[i].dest.y].type == "BISHOP") || (this.board[moves[i].dest.x][moves[i].dest.y].type == "QUEEN")) && this.board[moves[i].dest.x][moves[i].dest.y].color == color) {
			console.log("bishop or queen threatens "+color+" king");
			return true;
		}
	}
	moves = this.getRookMoves(sq,c);
	for (var i = 0; i < moves.length; i++) {
		if (this.board[moves[i].dest.x][moves[i].dest.y] != null && ((this.board[moves[i].dest.x][moves[i].dest.y].type == "ROOK") || (this.board[moves[i].dest.x][moves[i].dest.y].type == "QUEEN")) && this.board[moves[i].dest.x][moves[i].dest.y].color == color) {
			console.log("rook or queen threatens "+color+" king");
			return true;
		}
	}
	if (color == "BLACK") {
		try {
			if (this.board[sq.x+1][sq.y+1].type == "PAWN" && this.board[sq.x+1][sq.y+1].color == color) {
				return true;
			}
		} catch(e) {
			// console.log("ERR :: " + e.message);
		}
		try {
			if (this.board[sq.x+1][sq.y-1].type == "PAWN" && this.board[sq.x+1][sq.y-1].color == color) {
				return true;
			}
		} catch(e) {
			// console.log("ERR :: " + e.message);
		}
	} else /*turn == WHITE*/{
		try {
			if (this.board[sq.x-1][sq.y+1].type == "PAWN" && this.board[sq.x-1][sq.y+1].color == color) {
				return true;
			}
		} catch(e) {
			// console.log("ERR :: " + e.message);
		}
		try {
			if (this.board[sq.x-1][sq.y-1].type == "PAWN" && this.board[sq.x-1][sq.y-1].color == color) {
				return true;
			}
		} catch(e) {
			// console.log("ERR :: " + e.message);
		}
	}
	moves = this.getKingMovesWithoutCastles(sq,c);
	for (var i = 0; i < moves.length; i++) {
		if (this.board[moves[i].dest.x][moves[i].dest.y] != null && this.board[moves[i].dest.x][moves[i].dest.y].type == "KING" && this.board[moves[i].dest.x][moves[i].dest.y].color == color) {
			console.log("king threatens "+color+" king");
			return true;
		}
	}
	return false;
}
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
Game.prototype.getKingMoves = function(sq,color) {
	/*gets all moves from sq for the arg color king*/
	var moves = [];
	var list = [];
	list[list.length] = {x:sq.x+1,y:sq.y};
	list[list.length] = {x:sq.x+1,y:sq.y+1};
	list[list.length] = {x:sq.x+1,y:sq.y-1};
	list[list.length] = {x:sq.x-1,y:sq.y};
	list[list.length] = {x:sq.x-1,y:sq.y+1};
	list[list.length] = {x:sq.x-1,y:sq.y-1};
	list[list.length] = {x:sq.x,y:sq.y+1};
	list[list.length] = {x:sq.x,y:sq.y-1};
	for (var i = 0; i < list.length; i++) {
		if (list[i].x > -1 && list[i].x < 8 && list[i].y > -1 && list[i].y < 8) {
			if (this.board[list[i].x][list[i].y] == null || this.board[list[i].x][list[i].y].color != color) {
				moves[moves.length] = new Move(sq,list[i],this.get_piece(sq));
			}
		}
	}
	var c = getOppColor(color);
	if (!this.isSqThreatenedBy(sq,c)) {
		if (sq.x == 0 && sq.y == 4 && color == "WHITE" && this.castling[0] && this.board[sq.x][sq.y+1] == null && !this.isSqThreatenedBy({x:sq.x,y:sq.y+1},c) && this.board[sq.x][sq.y+2] == null && !this.isSqThreatenedBy({x:sq.x,y:sq.y+2},c)) {
			moves[moves.length] = new Move(sq,{x:sq.x,y:sq.y+2},this.get_piece(sq));
			console.log("kingside castling allowed for white");
		}
		if (sq.x == 0 && sq.y == 4 && color == "WHITE" && this.castling[1] && this.board[sq.x][sq.y-1] == null && !this.isSqThreatenedBy({x:sq.x,y:sq.y-1},c) && this.board[sq.x][sq.y-2] == null && !this.isSqThreatenedBy({x:sq.x,y:sq.y-2},c) && this.board[sq.x][sq.y-3] == null) {
			moves[moves.length] = new Move(sq,{x:sq.x,y:sq.y-2},this.get_piece(sq));
			console.log("queenside castling allowed for white");
		}
		if (sq.x == 7 && sq.y == 4 && color == "BLACK" && this.castling[2] && this.board[sq.x][sq.y+1] == null && !this.isSqThreatenedBy({x:sq.x,y:sq.y+1},c) && this.board[sq.x][sq.y+2] == null && !this.isSqThreatenedBy({x:sq.x,y:sq.y+2},c)) {
			moves[moves.length] = new Move(sq,{x:sq.x,y:sq.y+2},this.get_piece(sq));
			console.log("kingside castling allowed for black");
		}
		if (sq.x == 7 && sq.y == 4 && color == "BLACK" && this.castling[3] && this.board[sq.x][sq.y-1] == null && !this.isSqThreatenedBy({x:sq.x,y:sq.y-1},c) && this.board[sq.x][sq.y-2] == null && !this.isSqThreatenedBy({x:sq.x,y:sq.y-2},c) && this.board[sq.x][sq.y-3] == null) {
			moves[moves.length] = new Move(sq,{x:sq.x,y:sq.y-2},this.get_piece(sq));
			console.log("queenside castling allowed for black");
		}
	}
	return moves;
}
Game.prototype.getKingMovesWithoutCastles = function(sq,color) {
	/*gets all moves from sq in game for the arg color king but doesn't check for castling (avoids loops)*/
	var moves = [];
	var list = [];
	list[list.length] = {x:sq.x+1,y:sq.y};
	list[list.length] = {x:sq.x+1,y:sq.y+1};
	list[list.length] = {x:sq.x+1,y:sq.y-1};
	list[list.length] = {x:sq.x-1,y:sq.y};
	list[list.length] = {x:sq.x-1,y:sq.y+1};
	list[list.length] = {x:sq.x-1,y:sq.y-1};
	list[list.length] = {x:sq.x,y:sq.y+1};
	list[list.length] = {x:sq.x,y:sq.y-1};
	for (var i = 0; i < list.length; i++) {
		if (list[i].x > -1 && list[i].x < 8 && list[i].y > -1 && list[i].y < 8) {
			if (this.board[list[i].x][list[i].y] == null || this.board[list[i].x][list[i].y].color != color) {
				moves[moves.length] = new Move(sq,list[i],this.get_piece(sq));
			}
		}
	}
	return moves;
}
Game.prototype.getKnightMoves = function(sq,color) {
	/*gets all moves from sq in game for the arg color knight*/
	var moves = [];
	var list = [];
	list[list.length] = {x:sq.x+1,y:sq.y+2};
	list[list.length] = {x:sq.x+1,y:sq.y-2};
	list[list.length] = {x:sq.x+2,y:sq.y+1};
	list[list.length] = {x:sq.x+2,y:sq.y-1};
	list[list.length] = {x:sq.x-1,y:sq.y+2};
	list[list.length] = {x:sq.x-1,y:sq.y-2};
	list[list.length] = {x:sq.x-2,y:sq.y+1};
	list[list.length] = {x:sq.x-2,y:sq.y-1};
	for (var i = 0; i < list.length; i++) {
		if (list[i].x > -1 && list[i].x < 8 && list[i].y > -1 && list[i].y < 8) {
			if (this.board[list[i].x][list[i].y] == null || this.board[list[i].x][list[i].y].color != color) {
				moves[moves.length] = new Move(sq,list[i],this.get_piece(sq));

			}
		}
	}
	return moves;
}
Game.prototype.getQueenMoves = function(sq,color) {
	/*gets all moves from sq in game for the arg color queen*/
	var a = this.getRookMoves(sq,color);
	var b = this.getBishopMoves(sq,color);
	var moves = a.concat(b);
	return moves;
}
Game.prototype.getRookMoves = function(sq,color) {
	/*gets all moves from sq in game for the arg color rook*/
	var moves = [];
	var a = sq.x;
	var b = sq.y;
	while (a+1 < 8) {
		a++;
		if (this.board[a][b] == null || this.board[a][b].color != color) {
			moves[moves.length] = new Move(sq,{x:a,y:b},this.get_piece(sq));
			if (this.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	a = sq.x;
	b = sq.y;
	while (a-1 > -1) {
		a--;
		if (this.board[a][b] == null || this.board[a][b].color != color) {
			moves[moves.length] = new Move(sq,{x:a,y:b},this.get_piece(sq));
			if (this.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	a = sq.x;
	b = sq.y;
	while (b+1 < 8) {
		b++;
		if (this.board[a][b] == null || this.board[a][b].color != color) {
			moves[moves.length] = new Move(sq,{x:a,y:b},this.get_piece(sq));
			if (this.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	a = sq.x;
	b = sq.y;
	while (b-1 > -1) {
		b--;
		if (this.board[a][b] == null || this.board[a][b].color != color) {
			moves[moves.length] = new Move(sq,{x:a,y:b},this.get_piece(sq));
			if (this.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	return moves;
}
Game.prototype.getBishopMoves = function(sq,color) {
	/*gets all moves from sq in game for the arg color bishop*/
	var moves = [];
	var a = sq.x;
	var b = sq.y;
	while (a+1 < 8 && b+1 < 8) {
		a++;
		b++;
		if (this.board[a][b] == null || this.board[a][b].color != color) {
			moves[moves.length] = new Move(sq,{x:a,y:b},this.get_piece(sq));
			if (this.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	a = sq.x;
	b = sq.y;
	while (a+1 < 8 && b-1 > -1) {
		a++;
		b--;
		if (this.board[a][b] == null || this.board[a][b].color != color) {
			moves[moves.length] = new Move(sq,{x:a,y:b},this.get_piece(sq));
			if (this.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	a = sq.x;
	b = sq.y;
	while (a-1 > -1 && b+1 < 8) {
		a--;
		b++;
		if (this.board[a][b] == null || this.board[a][b].color != color) {
			moves[moves.length] = new Move(sq,{x:a,y:b},this.get_piece(sq));
			if (this.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	a = sq.x;
	b = sq.y;
	while (a-1 > -1 && b-1 > -1) {
		a--;
		b--;
		if (this.board[a][b] == null || this.board[a][b].color != color) {
			moves[moves.length] = new Move(sq,{x:a,y:b},this.get_piece(sq));
			if (this.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	return moves;
}
Game.prototype.getPawnMoves = function(sq,color) {
	/*gets all moves from sq in game for the arg color pawn*/
	var moves = [];
	if (color == "WHITE") {
		if (this.board[sq.x+1][sq.y] == null) {
			moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y},notation:null};
		}
		if (sq.x == 1 && this.board[sq.x+2][sq.y] == null && this.board[sq.x+1][sq.y] == null) {
			moves[moves.length] = {src:sq,dest:{x:sq.x+2,y:sq.y},notation:null};
		}
		if (sq.x+1 < 8 && sq.y+1 < 8 && this.board[sq.x+1][sq.y+1] != null && this.board[sq.x+1][sq.y+1].color != color) {
			moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y+1},notation:null};
		}
		if (sq.x+1 < 8 && sq.y-1 > -1 && this.board[sq.x+1][sq.y-1] != null && this.board[sq.x+1][sq.y-1].color != color) {
			moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y-1},notation:null};
		}
		if (this.enPassant_allowedAt != null) {
			if (this.enPassant_allowedAt.x == sq.x+1 && this.enPassant_allowedAt.y == sq.y+1) {
				moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y+1},notation:null};
			} else if (this.enPassant_allowedAt.x == sq.x+1 && this.enPassant_allowedAt.y == sq.y-1) {
				moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y-1},notation:null};
			}
		}
	} else /*if turn == BLACK*/{
		if (this.board[sq.x-1][sq.y] == null) {
			moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y},notation:null};
		}
		if (sq.x == 6 && this.board[sq.x-2][sq.y] == null && this.board[sq.x-1][sq.y] == null) {
			moves[moves.length] = {src:sq,dest:{x:sq.x-2,y:sq.y},notation:null};
		}
		if (sq.x-1 < 8 && sq.y+1 < 8 && this.board[sq.x-1][sq.y+1] != null && this.board[sq.x-1][sq.y+1].color != color) {
			moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y+1},notation:null};
		}
		if (sq.x-1 < 8 && sq.y-1 > -1 && this.board[sq.x-1][sq.y-1] != null && this.board[sq.x-1][sq.y-1].color != color) {
			moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y-1},notation:null};
		}
		if (this.enPassant_allowedAt != null) {
			if (this.enPassant_allowedAt.x == sq.x-1 && this.enPassant_allowedAt.y == sq.y+1) {
				moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y+1},notation:null};
			} else if (this.enPassant_allowedAt.x == sq.x-1 && this.enPassant_allowedAt.y == sq.y-1) {
				moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y-1},notation:null};
			}
		}
	}
	var m = [];
	for (var i = 0; i < moves.length; i++) {
		if (moves[i].dest.x == 7 || moves[i].dest.x == 0) {
			var n = "";
			if (moves[i].src.y != moves[i].dest.y) {
				n += "x";
			}
			n += pairToSq(moves[i].dest);
			moves[i].notation = n+"=N";
			m[m.length] = n+"=B";
			m[m.length] = n+"=R";
			m[m.length] = n+"=Q";
		}
	}
	moves.concat(m);
	return moves;
}


Move.prototype.print = function() {
	console.log(this.piece.color+" "+this.piece.type+"   "+this.src.x+","+this.src.y+" --> "+this.dest.x+","+this.dest.y);
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


