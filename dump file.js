





Game.prototype.copy = function() {
	/*copies Game into a new game object and returns that object*/
	var g = new Game(this.p1,this.p2,this.gametype,this.fen,this.pgn);
	// console.log("game.copy() :: successful");
	return g;
};
Game.prototype.change_turn = function() {
	/*changes the turn of Game*/
	this.turn = this.get_opp_color(this.get_turn());
};
Game.prototype.is_check = function(color) {
	/*returns whether or not the position in game is currently check*/
	var sq = this.get_king(color,this);
	// console.log(sq);
	// console.log(color);
	if (this.is_sq_threatened_by(sq,this.get_opp_color(color))) {
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
Game.prototype.get_players = function() {
	/*returns an object {p1,p2} which returns the respective players in Game*/
	return {p1:this.p1,p2:this.p2};
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


Game.prototype.get_legal_moves = function() {
	/*returns an array of legal moves from the position in Game*/
	console.log('get legal moves function happens');
	var moves = [];
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			try {
				if (this.get_piece({x:i,y:j}).color == this.get_turn()) {
					console.log('kek');
					var a = this.get_moves_from_sq({x:i,y:j});
					console.log(a);
					console.log("testing for moves from sq "+i+","+j);
					for (var b = 0; b < a.length; b++) {
						moves[moves.length] = a[b];
					}
				}
			} catch(e) {
				// console.log("ERR :: " + e.message);
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
Game.prototype.move_piece = function(move) {
	/*places piece on dest and sets the src to null*/
	this.set_piece(move.dest,move.piece);
	this.set_piece(move.src,null);
};
Game.prototype.game_after_move = function(move) {
	/*returns Game object after move has been made*/
	var g = this.copy();
	g.make_move(move,true);
	return g;
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
Game.prototype.get_piece = function(sq) {
	/*returns the piece at sq on Game.board*/
	return this.board[sq.x][sq.y];
};
Game.prototype.get_king = function(color) {
	/*finds the king of color in game*/
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (game.get_piece({x:i,y:j}) != null && game.get_piece({x:i,y:j}).type == "KING" && game.get_piece({x:i,y:j}),color == color) {
				return {x:i,y:j};
			}
		}
	}
	console.log("locateKing() :: no king of color "+color+" found on board");
	return null;
};
Game.prototype.get_king_moves = function(sq,color) {
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


Game.prototype.set_piece = function(sq,piece) {
	/*sets the sq on board equal to piece*/
	this.board[sq.x][sq.y] = piece;
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
Game.prototype.print_PGN = function() {
	var out = "";
	for (var i = 0; i < this.pgn.length; i++) {
		out += this.pgn[i].notation+" ";
	}
	console.log("\tPGN :: "+out);
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