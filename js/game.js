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
used as the object to store all the data associated with a 'move' calculation i.e. src, dest, piece, position*/
function Move(src, dest, piece, position) {
	this.src = src;
	this.dest = dest;
	this.piece = piece;
	this.position = position;
}


/*Game prototype getters*/
Game.prototype.get_FEN = function() {
	/*returns the FEN string (position) of the Game*/
	return this.fen;
};
Game.prototype.get_piece = function(sq) {
	/*returns the piece at sq on Game.board*/
	var board = board_from_FEN(this.get_FEN());
	return board[sq.x][sq.y];
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

/*Game prototype methods*/
Game.prototype.print = function(print_position) {
	/*prints information about Game to the console and prints out char based board graphic if print_position == true*/
	console.log("Game.prototype.print("+print_position+")");
	console.log("\t" + this.p1 + " vs " + this.p2);
	console.log("\tturn = \"" + this.get_turn()+"\"");
	console.log("\tcurrent pos = \""+this.get_FEN()+"\"");
	console.log("\t" + get_legal_moves(this.get_FEN()).length + " moves");
	var n = "";
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
	// console.log("\tcastling availability :: "+n);
	// if (this.is_check(game.turn)) {
	// 	console.log("\t" + game.turn + " KING in check");
	// } else {
	// 	console.log("\t" + game.turn + " KING is safe");
	// }
	this.print_PGN();
	// if (game.enPassant_allowedAt != null) {
	// 	console.log("\tenPassant legal at " + game.enPassant_allowedAt.x + "," + game.enPassant_allowedAt.y);
	// } else {
	// 	console.log("\tenPassant not legal");
	// }
	// console.log("\tcurrent FEN = "+this.get_FEN());
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


/*Move prototype methods*/
Move.prototype.print = function() {
	/*prints out Move data*/
	console.log("Move::   "+this.src.x+","+this.src.y+" --> "+this.dest.x+","+this.dest.y+"   =   "+this.piece.color+" "+this.piece.type);
	// console.log(this.position);
	// print_board(board_from_FEN(this.position));
};


/*helper functions*/
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
function board_to_FEN(old_fen,board,src,dest,piece) {
	/*returns an FEN from the current FEN to the following board position (src,dest,piece define the last move)*/
	// console.log(old_fen);
	var old_board = board_from_FEN(old_fen);
	// console.log("old board");
	// print_board(old_board);
	// console.log("new board");
	// print_board(board);
	var new_FEN = "";
	var inc = 0;
	for (var a = 0; a < 8; a++) {
		for (var b = 0; b < 8; b++) {
			if (board[7-a][b] == null) {
				inc++;
			} else {
				if (inc > 0) {
					new_FEN += inc;
					inc = 0;
				}
				if (board[7-a][b].color == "WHITE") {
					if (board[7-a][b].type == "KING") {
						new_FEN += "K";
					} else if (board[7-a][b].type == "QUEEN") {
						new_FEN += "Q";
					} else if (board[7-a][b].type == "BISHOP") {
						new_FEN += "B";
					} else if (board[7-a][b].type == "KNIGHT") {
						new_FEN += "N";
					} else if (board[7-a][b].type == "ROOK") {
						new_FEN += "R";
					} else if (board[7-a][b].type == "PAWN") {
						new_FEN += "P";
					}
				} else {
					if (board[7-a][b].type == "KING") {
						new_FEN += "k";
					} else if (board[7-a][b].type == "QUEEN") {
						new_FEN += "q";
					} else if (board[7-a][b].type == "BISHOP") {
						new_FEN += "b";
					} else if (board[7-a][b].type == "KNIGHT") {
						new_FEN += "n";
					} else if (board[7-a][b].type == "ROOK") {
						new_FEN += "r";
					} else if (board[7-a][b].type == "PAWN") {
						new_FEN += "p";
					}
				}
			}
		}
		if (inc > 0) {
			new_FEN += inc;
			inc = 0;
		}
		if (a != 7) {
			new_FEN += "/";
		}
	}
	new_FEN += " ";
	// switch turn data to reflect after a move has been made
	var c = 0;
	while (old_fen.charAt(c) != ' ') {
		c++;
	}
	c++;
	var was_blacks_turn = null;
	if (old_fen.charAt(c) == 'w') {
		new_FEN += "b";
		was_blacks_turn = false;
	} else if (old_fen.charAt(c) == 'b') {
		new_FEN += "w";
		was_blacks_turn = true;
	}
	c += 2;
	new_FEN += " ";
	// load castling data
	var castling_data = [];
	while (old_fen.charAt(c) != ' ') {
		if (old_fen.charAt(c) == 'K') {
			castling_data[0] = true;
		} else if (old_fen.charAt(c) == 'Q') {
			castling_data[1] = true;
		} else if (old_fen.charAt(c) == 'k') {
			castling_data[2] = true;
		} else if (old_fen.charAt(c) == 'q') {
			castling_data[3] = true;
		}
		c++;
	}
	// white, kingside
	if (castling_data[0]) {
		if (piece.color == "WHITE" && (piece.type == "KING" || (piece.type == "ROOK" && (board[0][7] == null || (board[0][7].type != "ROOK" || board[0][7].color != "WHITE"))))) {
			castling_data[0] = false;
		}
	}
	// white, queenside
	if (castling_data[1]) {
		if (piece.color == "WHITE" && (piece.type == "KING" || (piece.type == "ROOK" && (board[0][0] == null || (board[0][0].type != "ROOK" || board[0][0].color != "WHITE"))))) {
			castling_data[1] = false;
		}
	}
	// black, kingside
	if (castling_data[2]) {
		if (piece.color == "BLACK" && (piece.type == "KING" || (piece.type == "ROOK" && (board[7][7] == null || (board[7][7].type != "ROOK" || board[7][7].color != "BLACK"))))) {
			castling_data[2] = false;
		}
	}
	// black, queenside
	if (castling_data[3]) {
		if (piece.color == "BLACK" && (piece.type == "KING" || (piece.type == "ROOK" && (board[7][0] == null || (board[7][0].type != "ROOK" || board[7][0].color != "BLACK"))))) {
			castling_data[3] = false;
		}
	}
	if (castling_data[0]) {
		new_FEN += 'K';
	}
	if (castling_data[1]) {
		new_FEN += 'Q';
	}
	if (castling_data[2]) {
		new_FEN += 'k';
	}
	if (castling_data[3]) {
		new_FEN += 'q';
	}
	if (!castling_data[0] && !castling_data[1] && !castling_data[2] && !castling_data[3]) {
		new_FEN += '-';
	}
	new_FEN += " ";
	c++;
	if (piece.type == "PAWN") {
		// TODO possible change - only add sq if there is a pawn of the opposite color on one side or the other of the src piece?
		if (piece.color == "WHITE") {
			if (dest.x - src.x == 2) {
				new_FEN += pair_to_sq({x:2,y:src.y});
			} else {
				new_FEN += "-";
			}
		} else /*piece.color == "BLACK"*/ {
			if (src.x - dest.x == 2) {
				new_FEN += pair_to_sq({x:5,y:src.y});
			} else {
				new_FEN += "-";
			}
		}
	} else {
		new_FEN += "-";
	}
	new_FEN += " ";
	while (old_fen.charAt(c) != ' ') {
		c++;
	}
	c++;
	if (old_board[dest.x][dest.y] != null || piece.type == "PAWN") {
		new_FEN += "0";
	} else {
		var halfmove_str = ""; 
		while (old_fen.charAt(c) != ' ') {
			halfmove_str += old_fen.charAt(c);
			c++;
		}
		new_FEN += parseInt(halfmove_str)+1;
	}
	c += 2;
	new_FEN += " ";
	var turn_count_str = "";
	while (c < old_fen.length) {
		turn_count_str += old_fen.charAt(c);
		c++;
	}
	if (was_blacks_turn) {
		new_FEN += parseInt(turn_count_str)+1;
	} else {
		new_FEN += old_fen.charAt(c);
	}

	// console.log(new_FEN);
	return new_FEN;
}
function copy_board(board) {
	/*returns a copy of board*/
	var new_board = [
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null]
	];
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			new_board[i][j] = board[i][j];
		}
	}
	return new_board;
}
function get_castling_data(fen) {
	/*returns an array of length 4 of boolean data about castling legality reflected from the FEN parameter (KQkq)*/
	// console.log(fen);
	var c = 0;
	while (fen.charAt(c) != ' ') {
		c++;
	}
	c += 3;
	var castling_data = [];
	for (var i = 0; i < 4; i++) {
		castling_data[i] = false;
	}
	while (fen.charAt(c) != ' ') {
		if (fen.charAt(c) == 'K') {
			castling_data[0] = true;
		} else if (fen.charAt(c) == 'Q') {
			castling_data[1] = true;
		} else if (fen.charAt(c) == 'k') {
			castling_data[2] = true;
		} else if (fen.charAt(c) == 'q') {
			castling_data[3] = true;
		}
		c++;
	}
	// console.log(castling_data);
	return castling_data;
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
function get_king_loc(board,color) {
	/*returns the loc of the king of color on board in an x,y pair*/
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (board[i][j] != null && board[i][j].type == "KING" && board[i][j].color == color) {
				return {x:i,y:j};
			}
		}
	}
	return null;
}
function get_legal_moves(fen) {
	/*returns an array of legal moves that are the result of the position in fen*/
	var moves = [];
	var board = board_from_FEN(fen);
	// print_board(board);
	var n = 0;
	while (fen.charAt(n) != ' ') {
		n++;
	}
	n++;
	var turn = null;
	if (fen.charAt(n) == 'w') {
		turn = "WHITE";
	} else {
		turn = "BLACK";
	}
	// loop through board to find all pieces of the same color as turn
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			try {
				var piece = board[i][j];
				if (piece.color == turn) {
					// console.log("checking moves for piece \""+piece.color+" "+piece.type+"\" at "+i+","+j);
					var list_of_sqs = get_destinations_after_moves_from_sq(board,{x:i,y:j});
					// console.log(list_of_sqs);
					


					for (var n = 0; n < list_of_sqs.length; n++) {
						var new_board = copy_board(board);
						// print_board(new_board);
						// castling exception to position change
						if (piece.type == "KING") {
							// window.alert("piece.type == king");
							var castling_data = get_castling_data(fen);
							// window.alert("got castling_data");
							if (list_of_sqs[n].y - j == 2) {
								// kingside castle
								// console.log("kingside castle");
								if ((piece.color == "WHITE" && castling_data[0]) || (piece.color == "BLACK" && castling_data[2])) {
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = new_board[i][j];
									new_board[i][j] = null;
									new_board[i][j+1] = new_board[i][7];
									new_board[i][7] = null;
									var new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
								}
							} else if (j - list_of_sqs[n].y == 2) {
								// queenside castle
								// console.log("queenside castle");
								if ((piece.color == "WHITE" && castling_data[1]) || (piece.color == "BLACK" && castling_data[3])) {
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = new_board[i][j];
									new_board[i][j] = null;
									new_board[i][j-1] = new_board[i][0];
									new_board[i][0] = null;
									var new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
								}
							} else {
								// normal king move
								new_board[list_of_sqs[n].x][list_of_sqs[n].y] = new_board[i][j];
								new_board[i][j] = null;
								var new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
								moves[moves.length] = new_move;
								// new_move.print();
							}
						} else /*en passant && queening exception to position change*/ if (piece.type == "PAWN") {
							if (piece.color == "WHITE") {
								if (list_of_sqs[n].x == 5 && new_board[list_of_sqs[n].x][list_of_sqs[n].y] == null && list_of_sqs[n].y != j) {
									// en passant
									var fen_data = fen;
									var c = 0;
									var inc = 0;
									while (fen_data.charAt(c) != ' ' || inc < 2) {
										if (fen_data.charAt(c) == ' ') {
											inc++;
										}
										c++;
									}
									c++;
									if (fen_data.charAt(c) == '-') {
										// en passant not allowed
									} else /*en passant is allowed*/ {
										var tempsq = ""+fen_data.charAt(c)+fen_data.charAt(c+1)
										// console.log(tempsq);
										var en_passant_sq = sq_to_pair(tempsq);
										// console.log("en passant is allowed at the following sq:");
										// console.log(en_passant_sq);
										if (en_passant_sq.x == list_of_sqs[n].x && en_passant_sq.y == list_of_sqs[n].y) {
											// console.log("success");
											new_board[list_of_sqs[n].x][list_of_sqs[n].y] = new_board[i][j];
											new_board[i][j] = null;
											new_board[i][list_of_sqs[n].y] = null;
											var new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
											moves[moves.length] = new_move;
											// new_move.print();
										}
									}
								} else if (list_of_sqs[n].x == 7) {
									// queening
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = wQueen;
									new_board[i][j] = null;
									var new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = wBishop;
									new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = wKnight;
									new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = wRook;
									new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
								} else {
									// normal pawn move
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = new_board[i][j];
									new_board[i][j] = null;
									var new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
								}
							} else /*piece.color == "BLACK"*/ {
								if (list_of_sqs[n].x == 2 && new_board[list_of_sqs[n].x][list_of_sqs[n].y] == null && list_of_sqs[n].y != j) {
									// en passant
									var fen_data = fen;
									var c = 0;
									var inc = 0;
									while (fen_data.charAt(c) != ' ' || inc < 2) {
										if (fen_data.charAt(c) == ' ') {
											inc++;
										}
										c++;
									}
									c++;
									if (fen_data.charAt(c) == '-') {
										// en passant not allowed
									} else /*en passant is allowed*/ {
										var en_passant_sq = sq_to_pair(""+fen_data.charAt(c)+fen_data.charAt(c+1));
										// console.log("en passant is allowed at the following sq:");
										// console.log(en_passant_sq);
										if (en_passant_sq.x == list_of_sqs[n].x && en_passant_sq.y == list_of_sqs[n].y) {
											new_board[list_of_sqs[n].x][list_of_sqs[n].y] = new_board[i][j];
											new_board[i][j] = null;
											new_board[i][list_of_sqs[n].y] = null;
											var new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
											moves[moves.length] = new_move;
											// new_move.print();
										}
									}
								} else if (list_of_sqs[n].x == 0) {
									// queening
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = bQueen;
									new_board[i][j] = null;
									var new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = bBishop;
									new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = bKnight;
									new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = bRook;
									new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
								} else {
									// normal pawn move
									new_board[list_of_sqs[n].x][list_of_sqs[n].y] = new_board[i][j];
									new_board[i][j] = null;
									var new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
									moves[moves.length] = new_move;
									// new_move.print();
								}
							}
						} else {
							// all other cases - just move the piece from src to dest
							new_board[list_of_sqs[n].x][list_of_sqs[n].y] = new_board[i][j];
							new_board[i][j] = null;
							var new_move = new Move({x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece,board_to_FEN(fen,new_board,{x:i,y:j},{x:list_of_sqs[n].x,y:list_of_sqs[n].y},piece));
							moves[moves.length] = new_move;
							// new_move.print();
						}
					}
				}
			} catch(e) {
				// console.log(e.message);
			}
		}
	}

	for (var n = 0; n < moves.length; n++) {
		// moves[n].print();
		var king_loc = get_king_loc(board_from_FEN(moves[n].position),turn);
		// console.log(king_loc);
		if (sq_is_threatened_by(board_from_FEN(moves[n].position),king_loc,get_opp_color(turn))) {
			// console.log(turn+" king is in check");
			moves.splice(n,1);
			n--;
		}
	}
	// console.log(moves);
	return moves;
}
function get_opp_color(color) {
	/*returns the opp color of color*/
	if (color == "WHITE") {
		return "BLACK";
	} else if (color == "BLACK") {
		return "WHITE";
	} else {
		throw "Exception: color invalid.";
	}
}
function get_destinations_after_moves_from_sq(board,sq) {
	/*returns an array of destinations following the legal moves from the sq in board, on board*/
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
			// if WHITE king on e1
			if (source_piece_color == "WHITE" && sq.x == 0 && sq.y == 4) {
				// if there is a WHITE ROOK on h1 and f1 == null and g1 == null
				if (board[0][7].type == "ROOK" && board[0][7].color == source_piece_color && board[0][5] == null && board[0][6] == null) {
					// KINGSIDE CASTLE
					if (!sq_is_threatened_by(board,{x:0,y:4},get_opp_color(source_piece_color)) && !sq_is_threatened_by(board,{x:0,y:5},get_opp_color(source_piece_color)) && !sq_is_threatened_by(board,{x:0,y:6},get_opp_color(source_piece_color))) {
						list[list.length] = {x:0,y:6};
					}
				}
				// if there is a WHITE ROOK on a1 and b1 == null and c1 == null and d1 == null
				if (board[0][0].type == "ROOK" && board[0][0].color == source_piece_color && board[0][1] == null && board[0][2] == null && board[0][3] == null) {
					// QUEENSIDE CASTLE
					if (!sq_is_threatened_by(board,{x:0,y:4},get_opp_color(source_piece_color)) && !sq_is_threatened_by(board,{x:0,y:3},get_opp_color(source_piece_color)) && !sq_is_threatened_by(board,{x:0,y:2},get_opp_color(source_piece_color))) {
						list[list.length] = {x:0,y:2};
					}
				}
			} else /*if BLACK king on e8*/ if (source_piece_color == "BLACK" && sq.x == 7 && sq.y == 4) {
				// if there is a BLACK ROOK on h8 and f8 == null and g8 == null
				if (board[7][7].type == "ROOK" && board[7][7].color == source_piece_color && board[7][5] == null && board[7][6] == null) {
					// KINGSIDE CASTLE
					if (!sq_is_threatened_by(board,{x:7,y:4},get_opp_color(source_piece_color)) && !sq_is_threatened_by(board,{x:7,y:5},get_opp_color(source_piece_color)) && !sq_is_threatened_by(board,{x:7,y:6},get_opp_color(source_piece_color))) {
						list[list.length] = {x:7,y:6};
					}
				}
				// if there is a BLACK ROOK on a8 and b8 == null and c8 == null and d8 == null
				if (board[7][0].type == "ROOK" && board[7][0].color == source_piece_color && board[7][1] == null && board[7][2] == null && board[7][3] == null) {
					// QUEENSIDE CASTLE
					if (!sq_is_threatened_by(board,{x:7,y:4},get_opp_color(source_piece_color)) && !sq_is_threatened_by(board,{x:7,y:3},get_opp_color(source_piece_color)) && !sq_is_threatened_by(board,{x:7,y:2},get_opp_color(source_piece_color))) {
						list[list.length] = {x:7,y:2};
					}
				}
			}
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
			if (source_piece_color == "WHITE") {
				if (sq.x > 0 && sq.x < 7) {
					if (board[sq.x+1][sq.y] == null) {
						list[list.length] = {x:sq.x+1,y:sq.y};
					}
				}
				if (sq.x == 1) {
					if (board[sq.x+1][sq.y] == null && board[sq.x+2][sq.y] == null) {
						list[list.length] = {x:sq.x+2,y:sq.y};
					}
				}
				try {
					if (board[sq.x+1][sq.y+1].color == "BLACK") {
						list[list.length] = {x:sq.x+1,y:sq.y+1};
					}
				} catch(e) {
					// console.log(e.message);
				}
				try {
					if (board[sq.x+1][sq.y-1].color == "BLACK") {
						list[list.length] = {x:sq.x+1,y:sq.y-1};
					}
				} catch(e) {
					// console.log(e.message);
				}
				if (sq.x == 4) {
					try {
						if (board[sq.x][sq.y-1].color == "BLACK" && board[sq.x][sq.y-1].type == "PAWN" && board[sq.x+1][sq.y-1] == null) {
							list[list.length] = {x:sq.x+1,y:sq.y-1};
						}
					} catch(e) {
						// console.log(e.message);
					}
					try {
						if (board[sq.x][sq.y+1].color == "BLACK" && board[sq.x][sq.y+1].type == "PAWN" && board[sq.x+1][sq.y+1] == null) {
							list[list.length] = {x:sq.x+1,y:sq.y+1};
						}
					} catch(e) {
						// console.log(e.message);
					}
				}
			} else if (source_piece_color == "BLACK") {
				if (sq.x > 0 && sq.x < 7) {
					if (board[sq.x-1][sq.y] == null) {
						list[list.length] = {x:sq.x-1,y:sq.y};
					}
				}
				if (sq.x == 6) {
					if (board[sq.x-1][sq.y] == null && board[sq.x-2][sq.y] == null) {
						list[list.length] = {x:sq.x-2,y:sq.y};
					}
				}
				try {
					if (board[sq.x-1][sq.y+1].color == "WHITE") {
						list[list.length] = {x:sq.x-1,y:sq.y+1};
					}
				} catch(e) {
					// console.log(e.message);
				}
				try {
					if (board[sq.x-1][sq.y-1].color == "WHITE") {
						list[list.length] = {x:sq.x-1,y:sq.y-1};
					}
				} catch(e) {
					// console.log(e.message);
				}
				if (sq.x == 3) {
					try {
						if (board[sq.x][sq.y-1].color == "WHITE" && board[sq.x][sq.y-1].type == "PAWN" && board[sq.x-1][sq.y-1] == null) {
							list[list.length] = {x:sq.x-1,y:sq.y-1};
						}
					} catch(e) {
						// console.log(e.message);
					}
					try {
						if (board[sq.x][sq.y+1].color == "WHITE" && board[sq.x][sq.y+1].type == "PAWN" && board[sq.x-1][sq.y+1] == null) {
							list[list.length] = {x:sq.x-1,y:sq.y+1};
						}
					} catch(e) {
						// console.log(e.message);
					}
				}
			}
		}
		// index out of bounds check
		for (var i = 0; i < list.length; i++) {
			if (list[i].x < 0 || list[i].x > 7 || list[i].y < 0 || list[i].y > 7) {
				// console.log("index out of bounds, deleting sq "+list[i].x+","+list[i].y);
				list.splice(i,1);
				i--;
			}
		}
		// friendly piece check
		for (var i = 0; i < list.length; i++) {
			// console.log("friendly piece check for "+list[i].x+","+list[i].y);
			if (board[list[i].x][list[i].y] != null) {
				if (board[list[i].x][list[i].y].color == source_piece_color) {
					// console.log("sq occupied by friendly, deleting sq "+list[i].x+","+list[i].y);
					list.splice(i,1);
					i--;
				}
			}
		}
		// console.log("list length = "+list.length);
	} catch(e) {
		console.log(e.message);
	}
	return list;
}
function pair_to_sq(sq) {
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
function sq_is_threatened_by(board,sq,color) {
	/*returns a boolean result if sq on board is threatened by color*/
	var piece = null;
	var list = [];
	// checking king threats
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
			try {
				piece = board[list[i].x][list[i].y];
				if (piece.color == color && piece.type == "KING") {
					// console.log(list[i].x+","+list[i].y+" is threatened by "+color+" king");
					return true;
				}
			} catch(e) {
				// console.log(e.message);
			}
		}
	}
	piece = null;
	list = [];
	// checking knight threats
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
			try {
				piece = board[list[i].x][list[i].y];
				if (piece.color == color && piece.type == "KNIGHT") {
					// console.log(list[i].x+","+list[i].y+" is threatened by "+color+" knight");
					return true;
				}
			} catch(e) {
				// console.log(e.message);
			}
		}
	}
	piece = null;
	// checking flat threats
	var a = sq.x;
	var b = sq.y;
	while (a+1 < 8) {
		a++;
		piece = board[a][b];
		if (piece != null) {
			if (piece.color == color && (piece.type == "ROOK" || piece.type == "QUEEN")) {
				return true;
			} else {
				break;
			}
		}
	}
	a = sq.x;
	while (a-1 > -1) {
		a--;
		piece = board[a][b];
		if (piece != null) {
			if (piece.color == color && (piece.type == "ROOK" || piece.type == "QUEEN")) {
				return true;
			} else {
				break;
			}
		}
	}
	a = sq.x;
	while (b+1 < 8) {
		b++;
		piece = board[a][b];
		if (piece != null) {
			if (piece.color == color && (piece.type == "ROOK" || piece.type == "QUEEN")) {
				return true;
			} else {
				break;
			}
		}
	}
	b = sq.y;
	while (b-1 > -1) {
		b--;
		piece = board[a][b];
		if (piece != null) {
			if (piece.color == color && (piece.type == "ROOK" || piece.type == "QUEEN")) {
				return true;
			} else {
				break;
			}
		}
	}
	b = sq.y;
	// checking diagonal threats
	while (a+1 < 8 && b+1 < 8) {
		a++;
		b++;
		piece = board[a][b];
		if (piece != null) {
			if (piece.color == color && (piece.type == "BISHOP" || piece.type == "QUEEN")) {
				return true;
			} else {
				break;
			}
		}
	}
	a = sq.x;
	b = sq.y;
	while (a+1 < 8 && b-1 > -1) {
		a++;
		b--;
		piece = board[a][b];
		if (piece != null) {
			if (piece.color == color && (piece.type == "BISHOP" || piece.type == "QUEEN")) {
				return true;
			} else {
				break;
			}
		}
	}
	a = sq.x;
	b = sq.y;
	while (a-1 > -1 && b+1 < 8) {
		a--;
		b++;
		piece = board[a][b];
		if (piece != null) {
			if (piece.color == color && (piece.type == "BISHOP" || piece.type == "QUEEN")) {
				return true;
			} else {
				break;
			}
		}
	}
	a = sq.x;
	b = sq.y;
	while (a-1 > -1 && b-1 > -1) {
		a--;
		b--;
		piece = board[a][b];
		if (piece != null) {
			if (piece.color == color && (piece.type == "BISHOP" || piece.type == "QUEEN")) {
				return true;
			} else {
				break;
			}
		}
	}
	// checking pawn threats
	if (color == "WHITE") {
		try {
			piece = board[sq.x-1][sq.y-1];
			if (piece.color == color && piece.type == "PAWN") {
				return true;
			}
		} catch(e) {
			// console.log(e.message);
		}
		try {
			piece = board[sq.x-1][sq.y+1];
			if (piece.color == color && piece.type == "PAWN") {
				return true;
			}
		} catch(e) {
			// console.log(e.message);
		}
	} else if (color == "BLACK") {
		try {
			piece = board[sq.x+1][sq.y-1];
			if (piece.color == color && piece.type == "PAWN") {
				return true;
			}
		} catch(e) {
			// console.log(e.message);
		}
		try {
			piece = board[sq.x+1][sq.y+1];
			if (piece.color == color && piece.type == "PAWN") {
				return true;
			}
		} catch(e) {
			// console.log(e.message);
		}
	}
	// return false if none of the above conditions have led to a returning true
	return false;
}
function sq_to_pair(sq) {
	/*returns a sq {x,y} from the input string ex: e4*/
	var file;
	switch (sq.charAt(0)) {
		case 'a': file = 0; break;
		case 'b': file = 1; break;
		case 'c': file = 2; break;
		case 'd': file = 3; break;
		case 'e': file = 4; break;
		case 'f': file = 5; break;
		case 'g': file = 6; break;
		case 'h': file = 7; break;
		default: console.log("ERR :: sq.charAt(0) != a-h");
	}
	return {x:parseInt(sq.charAt(1))-1,y:file};
}




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