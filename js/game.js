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
/*Move object constructor
used as the object to store all the data associated with a 'move' calculation i.e. src, dest, piece*/
function Move(src, dest, piece) {
	this.src = src;
	this.dest = dest;
	this.piece = piece;
}



Game.prototype.change_turn = function() {
	/*changes the turn of Game*/
	this.turn = this.get_opp_color(this.get_turn());
};
Game.prototype.copy = function() {
	/*copies Game into a new game object and returns that object*/
	var g = new Game(this.p1,this.p2,this.gametype,this.fen,this.pgn);
	// console.log("game.copy() :: successful");
	return g;
};

Game.prototype.is_legal_move = function(move) {
	console.log("lel");
	/*returns whether or not the move from src -> dest is a legal move*/
	var moves = this.get_legal_moves();
	for (var i = 0; i < moves.length; i++) {
		if (moves[i].src.x == move.src.x && moves[i].src.y == move.src.y &&
			moves[i].dest.x == move.dest.x && moves[i].dest.y == move.dest.y) {
			console.log("is_legal_move() true");
		return true;
	}
}
return false;
}

Game.prototype.move_piece = function(move) {
	/*places piece on dest and sets the src to null*/
	this.set_piece(move.dest,move.piece);
	this.set_piece(move.src,null);
};

Game.prototype.make_move = function(move,force_move) {
	/*attempts to make move of piece but checks move legality first if force_move != true*/
	// move.print();
	if (force_move || this.is_legal_move(move)) {
		// console.log("moving piece "+move.piece.color+" "+move.piece.type);
		// move.print();
		// this.add_move_to_PGN(move);
		this.move_piece(move);
		this.change_turn();
	} else {
		console.log(".make_move :: move is not valid");
		console.log(move);
	}
	this.set_FEN();
	// this.print();
};



Game.prototype.game_after_move = function(move) {
	/*returns Game object after move has been made*/
	var g = this.copy();
	g.make_move(move,true);
	return g;
};


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
	console.log("\tget_legal_moves() before filtered checks length = "+moves.length);
	for (var a = 0; a < moves.length; a++) {
		var g = this.game_after_move(moves[a]);
		g.printPos();
		if (g.is_check(game.turn)) {
			moves.remove(a);
			a--;
		}
	}
	console.log("\tget_legal_moves() after filtered checks length = "+moves.length);
	for (var d = 0; d < moves.length; d++) {
		moves[d].print();
	}
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
		return this.get_king_moves(sq,piece.color);
	} else if (piece.type == "QUEEN") {
		return this.get_queen_moves(sq,piece.color);
	} else if (piece.type == "BISHOP") {
		return this.get_bishop_moves(sq,piece.color);
	} else if (piece.type == "KNIGHT") {
		return this.get_knight_moves(sq,piece.color);
	} else if (piece.type == "ROOK") {
		return this.get_rook_moves(sq,piece.color);
	} else if (piece.type == "PAWN") {
		return this.get_pawn_moves(sq,piece.color);
	}
	return [];
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




Game.prototype.get_king_moves = function(sq,color) {
	/*gets all moves from sq for the arg color king*/
	var moves = [];
	var list = [];
	// building a list of sqs surrounding the source sq
	list[list.length] = {x:sq.x+1,y:sq.y};
	list[list.length] = {x:sq.x+1,y:sq.y+1};
	list[list.length] = {x:sq.x+1,y:sq.y-1};
	list[list.length] = {x:sq.x-1,y:sq.y};
	list[list.length] = {x:sq.x-1,y:sq.y+1};
	list[list.length] = {x:sq.x-1,y:sq.y-1};
	list[list.length] = {x:sq.x,y:sq.y+1};
	list[list.length] = {x:sq.x,y:sq.y-1};
	// for loop adds each move to the 'moves' array declared above if the sq is both in bounds of the board and is not occupied by a friendly piece
	for (var i = 0; i < list.length; i++) {
		if (list[i].x > -1 && list[i].x < 8 && list[i].y > -1 && list[i].y < 8) {
			if (this.board[list[i].x][list[i].y] == null || this.board[list[i].x][list[i].y].color != color) {
				moves[moves.length] = new Move(sq,list[i],this.get_piece(sq));
			}
		}
	}
	var c = this.get_opp_color(color);
	if (!this.is_sq_threatened_by(sq,c)) {
		if (sq.x == 0 && sq.y == 4 && color == "WHITE" && this.castling[0] && this.board[sq.x][sq.y+1] == null && !this.is_sq_threatened_by({x:sq.x,y:sq.y+1},c) && this.board[sq.x][sq.y+2] == null && !this.is_sq_threatened_by({x:sq.x,y:sq.y+2},c)) {
			moves[moves.length] = new Move(sq,{x:sq.x,y:sq.y+2},this.get_piece(sq));
			console.log("kingside castling allowed for white");
		}
		if (sq.x == 0 && sq.y == 4 && color == "WHITE" && this.castling[1] && this.board[sq.x][sq.y-1] == null && !this.is_sq_threatened_by({x:sq.x,y:sq.y-1},c) && this.board[sq.x][sq.y-2] == null && !this.is_sq_threatened_by({x:sq.x,y:sq.y-2},c) && this.board[sq.x][sq.y-3] == null) {
			moves[moves.length] = new Move(sq,{x:sq.x,y:sq.y-2},this.get_piece(sq));
			console.log("queenside castling allowed for white");
		}
		if (sq.x == 7 && sq.y == 4 && color == "BLACK" && this.castling[2] && this.board[sq.x][sq.y+1] == null && !this.is_sq_threatened_by({x:sq.x,y:sq.y+1},c) && this.board[sq.x][sq.y+2] == null && !this.is_sq_threatened_by({x:sq.x,y:sq.y+2},c)) {
			moves[moves.length] = new Move(sq,{x:sq.x,y:sq.y+2},this.get_piece(sq));
			console.log("kingside castling allowed for black");
		}
		if (sq.x == 7 && sq.y == 4 && color == "BLACK" && this.castling[3] && this.board[sq.x][sq.y-1] == null && !this.is_sq_threatened_by({x:sq.x,y:sq.y-1},c) && this.board[sq.x][sq.y-2] == null && !this.is_sq_threatened_by({x:sq.x,y:sq.y-2},c) && this.board[sq.x][sq.y-3] == null) {
			moves[moves.length] = new Move(sq,{x:sq.x,y:sq.y-2},this.get_piece(sq));
			console.log("queenside castling allowed for black");
		}
	}
	return moves;
};
Game.prototype.get_king_moves_without_castles = function(sq,color) {
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
};
Game.prototype.get_knight_moves = function(sq,color) {
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
};
Game.prototype.get_queen_moves = function(sq,color) {
	/*gets all moves from sq in game for the arg color queen*/
	var a = this.get_rook_moves(sq,color);
	var b = this.get_bishop_moves(sq,color);
	var moves = a.concat(b);
	return moves;
};
Game.prototype.get_rook_moves = function(sq,color) {
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
};
Game.prototype.get_bishop_moves = function(sq,color) {
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
};
Game.prototype.get_pawn_moves = function(sq,color) {
	/*gets all moves from sq in game for the arg color pawn*/
	var moves = [];
	if (color == "WHITE") {
		// single move
		if (this.board[sq.x+1][sq.y] == null) {
			moves[moves.length] = new Move(sq,{x:sq.x+1,y:sq.y},this.get_piece(sq));
		}
		// first move for pawn, two square move
		if (sq.x == 1 && this.board[sq.x+2][sq.y] == null && this.board[sq.x+1][sq.y] == null) {
			moves[moves.length] = new Move(sq,{x:sq.x+2,y:sq.y},this.get_piece(sq));
		}
		// capture
		if (sq.x+1 < 8 && sq.y+1 < 8 && this.board[sq.x+1][sq.y+1] != null && this.board[sq.x+1][sq.y+1].color != color) {
			moves[moves.length] = new Move(sq,{x:sq.x+1,y:sq.y+1},this.get_piece(sq));
		}
		if (sq.x+1 < 8 && sq.y-1 > -1 && this.board[sq.x+1][sq.y-1] != null && this.board[sq.x+1][sq.y-1].color != color) {
			moves[moves.length] = new Move(sq,{x:sq.x+1,y:sq.y-1},this.get_piece(sq));
		}
		// en passant
		if (this.enPassant_allowedAt != null) {
			if (this.enPassant_allowedAt.x == sq.x+1 && this.enPassant_allowedAt.y == sq.y+1) {
				moves[moves.length] = new Move(sq,{x:sq.x+1,y:sq.y+1},this.get_piece(sq));
			} else if (this.enPassant_allowedAt.x == sq.x+1 && this.enPassant_allowedAt.y == sq.y-1) {
				moves[moves.length] = new Move(sq,{x:sq.x+1,y:sq.y-1},this.get_piece(sq));
			}
		}
	} else /*if turn == BLACK*/{
		// single move
		if (this.board[sq.x-1][sq.y] == null) {
			moves[moves.length] = new Move(sq,{x:sq.x-1,y:sq.y},this.get_piece(sq));
		}
		// first move for pawn, two square move
		if (sq.x == 6 && this.board[sq.x-2][sq.y] == null && this.board[sq.x-1][sq.y] == null) {
			moves[moves.length] = new Move(sq,{x:sq.x-2,y:sq.y},this.get_piece(sq));
		}
		// capture
		if (sq.x-1 > -1 && sq.y+1 < 8 && this.board[sq.x-1][sq.y+1] != null && this.board[sq.x-1][sq.y+1].color != color) {
			moves[moves.length] = new Move(sq,{x:sq.x-1,y:sq.y+1},this.get_piece(sq));
		}
		if (sq.x-1 > -1 && sq.y-1 > -1 && this.board[sq.x-1][sq.y-1] != null && this.board[sq.x-1][sq.y-1].color != color) {
			moves[moves.length] = new Move(sq,{x:sq.x-1,y:sq.y-1},this.get_piece(sq));
		}
		// en passant
		if (this.enPassant_allowedAt != null) {
			if (this.enPassant_allowedAt.x == sq.x+1 && this.enPassant_allowedAt.y == sq.y+1) {
				moves[moves.length] = new Move(sq,{x:sq.x-1,y:sq.y+1},this.get_piece(sq));
			} else if (this.enPassant_allowedAt.x == sq.x-1 && this.enPassant_allowedAt.y == sq.y-1) {
				moves[moves.length] = new Move(sq,{x:sq.x-1,y:sq.y-1},this.get_piece(sq));
			}
		}
	}
	for (var i = 0; i < moves.length; i++) {
		if (moves[i].dest.x == 7) {
			moves[i].piece = wKnight;
			moves[moves.length] = new Move(sq,moves[i].dest,wBishop);
			moves[moves.length] = new Move(sq,moves[i].dest,wRook);
			moves[moves.length] = new Move(sq,moves[i].dest,wQueen);
		} else if (moves[i].dest.x == 0) {
			moves[i].piece = bKnight;
			moves[moves.length] = new Move(sq,moves[i].dest,bBishop);
			moves[moves.length] = new Move(sq,moves[i].dest,bRook);
			moves[moves.length] = new Move(sq,moves[i].dest,bQueen);
		}
	}
	return moves;
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
Game.prototype.set_piece = function(sq,piece) {
	/*sets the sq on board equal to piece*/
	this.board[sq.x][sq.y] = piece;
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
Game.prototype.get_players = function() {
	/*returns an object {p1,p2} which returns the respective players in Game*/
	return {p1:this.p1,p2:this.p2};
};



Game.prototype.pair_to_sq = function(sq) {
	/*converts the square in the array to the square on the chessboard
	ex: e4 */
	var square = "";
	switch (sq.y) {
		case 0: square += "a"; break;
		case 1: square += "b"; break;
		case 2: square += "c"; break;
		case 3: square += "d"; break;
		case 4: square += "e"; break;
		case 5: square += "f"; break;
		case 6: square += "g"; break;
		case 7: square += "h"; break;
		default: console.log("ERR :: sq out of range");
	}
	square += sq.x+1;
	return square;
};




Move.prototype.print = function() {
	console.log(this.piece.color+" "+this.piece.type+"   "+this.src.x+","+this.src.y+" --> "+this.dest.x+","+this.dest.y);
};
Move.prototype.get_notation = function() {
	/*returns a string containing the notation of the move in game*/
	// var notation = "";
	// if (piece == null) {
	// 	return null;
	// }
	// if (piece.type == "KING") {
	// 	notation += "K";
	// } else if (piece.type == "QUEEN") {
	// 	notation += "Q";
	// } else if (piece.type == "BISHOP") {
	// 	notation += "B";
	// } else if (piece.type == "KNIGHT") {
	// 	notation += "N";
	// } else if (piece.type == "ROOK") {
	// 	notation += "R";
	// } else {
	// 	//add nothing
	// }
	// if (game.get_piece(move.dest) != null) {
	// 	notation += "x";
	// }
	// notation += pairToSq(move.dest);
	// if (game.game_after_move(move).is_checkmate()) {
	// 	notation += "#";
	// } else if (game.game_after_move(move).is_check()) {
	// 	notation += "+";
	// }
	// return notation;
};

Game.prototype.is_sq_threatened_by = function(sq,color) {
	/*returns a boolean if the sq on Game is threatened by color*/
	var moves = [];
	var c = this.get_opp_color(color);
	moves = this.get_knight_moves(sq,c);
	for (var i = 0; i < moves.length; i++) {
		if (game.board[moves[i].dest.x][moves[i].dest.y] != null && game.board[moves[i].dest.x][moves[i].dest.y].type == "KNIGHT" && game.board[moves[i].dest.x][moves[i].dest.y].color == color) {
			console.log("knight threatens "+color+" king");
			return true;
		}
	}
	moves = this.get_bishop_moves(sq,c);
	for (var i = 0; i < moves.length; i++) {
		if (this.board[moves[i].dest.x][moves[i].dest.y] != null && ((this.board[moves[i].dest.x][moves[i].dest.y].type == "BISHOP") || (this.board[moves[i].dest.x][moves[i].dest.y].type == "QUEEN")) && this.board[moves[i].dest.x][moves[i].dest.y].color == color) {
			console.log("bishop or queen threatens "+color+" king");
			return true;
		}
	}
	moves = this.get_rook_moves(sq,c);
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
	moves = this.get_king_moves_without_castles(sq,c);
	for (var i = 0; i < moves.length; i++) {
		if (this.board[moves[i].dest.x][moves[i].dest.y] != null && this.board[moves[i].dest.x][moves[i].dest.y].type == "KING" && this.board[moves[i].dest.x][moves[i].dest.y].color == color) {
			console.log("king threatens "+color+" king");
			return true;
		}
	}
	return false;
}


Game.prototype.is_check = function(color) {
	/*returns whether or not the position in game is currently check*/
	var sq = this.get_king(color);
	console.log(sq);
	if (this.is_sq_threatened_by(sq,this.get_opp_color(color))) {
		console.log("CHECK");
		return true;
	}
	console.log("NOT CHECK");
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
		this.printPos();
	}
};
Game.prototype.printPos = function() {
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