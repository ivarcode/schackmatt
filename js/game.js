/*
game.js
*/

/* GAME */

/*Game object constructor
used as the object to store all the data associated with a created 'game' of chess*/
function Game(white, black, gametype, pos, pgn) {
	// console.log("Creating game object...");
	this.white = white;
	this.black = black;
	this.gametype = gametype;
	this.fen = pos;
	this.pgn = pgn;
}
/*Move object constructor
used as the object to store all the data associated with a 'move' calculation i.e. src, dest, piece, position, notation*/
function Move(src, dest, piece, position, notation) {
	this.src = src;
	this.dest = dest;
	this.piece = piece;
	this.position = position;
	this.notation = notation;
}


function board_from_fen(fen) {
	/*returns the board in array form from the param fen*/
	// initializes board array
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
	// initializing counter vars
	var i = 0;
	var a = 7;
	var b = 0;
	while (true) {
		if (fen.charAt(i) == 'k' || fen.charAt(i) == 'q' || fen.charAt(i) == 'b' || fen.charAt(i) == 'n' || fen.charAt(i) == 'r' || fen.charAt(i) == 'p' || fen.charAt(i) == 'K' || fen.charAt(i) == 'Q' || fen.charAt(i) == 'B' || fen.charAt(i) == 'N' || fen.charAt(i) == 'R' || fen.charAt(i) == 'P') {
			board[a][b] = fen.charAt(i);
			i++;
			b++;
		} else if (fen.charAt(i) == '/') {
			// move down rank
			a--;
			i++;
			// reset file to 0 (a)
			b = 0;
		} else if (fen.charAt(i) == ' ') {
			// done filling board with pieces, break loop
			break;
		} else {
			// set n to number of blank sqs
			var n = parseInt(fen.charAt(i));
			while (n > 0) {
				board[a][b] = null;
				b++;
				// decrement n
				n--;
			}
			i++;
		}
	}
	return board;
}
function calculate_material_balance(fen) {
	/*function that calculates and returns the material balance of the input FEN +/- W/B advantage*/
	var material_balance = 0;
	var board = board_from_fen(fen);
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (board[i][j] != null) {
				var piece = board[i][j];
				switch (piece) {
					case 'Q': material_balance+=9;break;
					case 'R': material_balance+=5;break;
					case 'B': material_balance+=3;break;
					case 'N': material_balance+=3;break;
					case 'P': material_balance+=1;break;
					case 'q': material_balance-=9;break;
					case 'r': material_balance-=5;break;
					case 'b': material_balance-=3;break;
					case 'n': material_balance-=3;break;
					case 'p': material_balance-=1;break;
				}
			}
		}
	}
	return material_balance;
}
function get_castling_data(fen) {
	/*gets the sides of the board allowed to be castled on for both sides*/
	var i = 0;
	// skips through board
	while (fen.charAt(i) != ' ') {
		i++;
	}
	i += 2;
	// checks if - identifies no legal castles for either side
	if (fen.charAt(i) == '-') {
		return "-";
	}
	// add to data
	data = fen.charAt(i);
	i++;
	// add the rest to data
	while (fen.charAt(i) != ' ') {
		data += fen.charAt(i);
		i++;
	}
	return data;
}
function get_en_passant_sq(fen) {
	/*returns the square in object {rank,file} form if en passant sq exists, else returns null*/
	var i = 0;
	// set i to en passant sq
	while (fen.charAt(i) != ' ') {
		i++;
	}
	i+=3;
	while (fen.charAt(i) != ' ') {
		i++;
	}
	i++;
	if (fen.charAt != '-') {
		// sq exists, create an object of its coordinates
		var sq = {rank:parseInt(fen.charAt(i+1))-1,file:null};
		switch (fen.charAt(i)) {
			case 'a': sq.file = 0;break;
			case 'b': sq.file = 1;break;
			case 'c': sq.file = 2;break;
			case 'd': sq.file = 3;break;
			case 'e': sq.file = 4;break;
			case 'f': sq.file = 5;break;
			case 'g': sq.file = 6;break;
			case 'h': sq.file = 7;break;
		}
		return sq;
	}
	return null;
}
function get_legal_moves(fen) {
	/*gets all the legal moves from the fen*/
	// initializes empty moves array
	var moves = [];
	// translates the fen to the var board in array form
	var board = board_from_fen(fen);
	var turn = get_turn(fen);
	// loop through each piece in board
	for (var r = 0; r < 8; r++) {
		for (var f = 0; f < 8; f++) {
			// initialize piece var
			var piece = board[r][f];
			// if piece is not null AND (if piece is white and turn == white OR if piece is black and turn == black)
			if (piece != null && ((is_white(piece) && turn == "WHITE") || (is_black(piece) && turn == "BLACK"))) {
				console.log(piece);
				if (piece == 'K' || piece == 'k') {
					// KING
					var sqs = [];
					sqs.push({rank:r+1,file:f});
					sqs.push({rank:r+1,file:f+1});
					sqs.push({rank:r+1,file:f-1});
					sqs.push({rank:r-1,file:f});
					sqs.push({rank:r-1,file:f+1});
					sqs.push({rank:r-1,file:f-1});
					sqs.push({rank:r,file:f+1});
					sqs.push({rank:r,file:f-1});
					// loop through sqs array
					for (var i = 0; i < sqs.length; i++) {
						// if sq is on board
						if (sqs[i].rank < 8 && sqs[i].rank > -1 && sqs[i].file < 8 && sqs[i].file > -1) {
							// if sq is not occupied by friendly piece
							if (board[sqs[i].rank][sqs[i].file] == null || ((is_white(board[sqs[i].rank][sqs[i].file]) && turn == "BLACK") || (is_black(board[sqs[i].rank][sqs[i].file]) && turn == "WHITE"))) {
								// add move to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:sqs[i].rank,file:sqs[i].file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sqs[i].rank,file:sqs[i].file},
										piece,
										board),
									null);
								moves.push(move);
							}
						}
					}
					// check if castling is legal
					if (is_white(piece)) {
						// if king is on starting sq
						if (r == 0 && f == 4) {
							// if castling data is not '-'
							var d = get_castling_data(fen);
							if (d != '-') {
								// loop through castling data and try to see if each castle is legal on each char
								for (var i = 0; i < d.length; i++) {
									// if kingside castle is allowed in game
									if (d.charAt(i) == 'K') {
										// if f1 and g1 are clear
										if (board[0][5] == null && board[0][6] == null) {
											// if f1 is not going through check for white
											if (!is_sq_threatened_by(board,{x:0,y:5},"BLACK")) {
												// add move to moves array
												var move = new Move(
													{rank:r,file:f},
													{rank:0,file:6},
													piece,
													get_position_after_move_on_board(
														{rank:r,file:f},
														{rank:0,file:6},
														piece,
														board),
													null);
												moves.push(move);
											}
										}
									}
									// if queenside castle is allowed in game
									if (d.charAt(i) == 'Q') {

									}
								}
							}
						}
					} else /*is_black(piece)*/ {

					}


				} else if (piece == 'Q' || piece == 'q') {
					// QUEEN
					var sq = {rank:r+1,file:f+1};
					// up - right
					while (sq.rank < 8 && sq.file < 8) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank++;
							sq.file++;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.rank = r-1;
					sq.file = f+1;
					// up - left
					while (sq.rank > -1 && sq.file < 8) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank--;
							sq.file++;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.rank = r-1;
					sq.file = f-1;
					// down - left
					while (sq.rank > -1 && sq.file > -1) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank--;
							sq.file--;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.rank = r+1;
					sq.file = f-1;
					// down - right
					while (sq.rank < 8 && sq.file > -1) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank++;
							sq.file--;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq = {rank:r+1,file:f};
					// up
					while (sq.rank < 8) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank++;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.rank = r-1;
					// down
					while (sq.rank > -1) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank--;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.rank = r;
					sq.file = f+1;
					// right
					while (sq.file < 8) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.file++;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.file = f-1;
					// left
					while (sq.file > -1) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.file--;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
				} else if (piece == 'B' || piece == 'b') {
					// BISHOP
					var sq = {rank:r+1,file:f+1};
					// up - right
					while (sq.rank < 8 && sq.file < 8) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank++;
							sq.file++;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.rank = r-1;
					sq.file = f+1;
					// up - left
					while (sq.rank > -1 && sq.file < 8) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank--;
							sq.file++;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.rank = r-1;
					sq.file = f-1;
					// down - left
					while (sq.rank > -1 && sq.file > -1) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank--;
							sq.file--;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.rank = r+1;
					sq.file = f-1;
					// down - right
					while (sq.rank < 8 && sq.file > -1) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank++;
							sq.file--;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
				} else if (piece == 'N' || piece == 'n') {
					// KNIGHT
					var sqs = [];
					sqs.push({rank:r+2,file:f+1});
					sqs.push({rank:r+2,file:f-1});
					sqs.push({rank:r+1,file:f+2});
					sqs.push({rank:r+1,file:f-2});
					sqs.push({rank:r-2,file:f+1});
					sqs.push({rank:r-2,file:f-1});
					sqs.push({rank:r-1,file:f+2});
					sqs.push({rank:r-1,file:f-2});
					// loop through sqs array
					for (var i = 0; i < sqs.length; i++) {
						// if sq is on board
						if (sqs[i].rank < 8 && sqs[i].rank > -1 && sqs[i].file < 8 && sqs[i].file > -1) {
							// if sq is not occupied by friendly piece
							if (board[sqs[i].rank][sqs[i].file] == null || ((is_white(board[sqs[i].rank][sqs[i].file]) && turn == "BLACK") || (is_black(board[sqs[i].rank][sqs[i].file]) && turn == "WHITE"))) {
								// add move to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:sqs[i].rank,file:sqs[i].file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sqs[i].rank,file:sqs[i].file},
										piece,
										board),
									null);
								moves.push(move);
							}
						}
					}
				} else if (piece == 'R' || piece == 'r') {
					// ROOK
					var sq = {rank:r+1,file:f};
					// up
					while (sq.rank < 8) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank++;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.rank = r-1;
					// down
					while (sq.rank > -1) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.rank--;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.rank = r;
					sq.file = f+1;
					// right
					while (sq.file < 8) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.file++;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
					sq.file = f-1;
					// left
					while (sq.file > -1) {
						// if sq is empty
						if (board[sq.rank][sq.file] == null) {
							var move = new Move(
								{rank:r,file:f},
								{rank:sq.rank,file:sq.file},
								piece,
								get_position_after_move_on_board(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									board),
								null);
							moves.push(move);
							sq.file--;
						} else /*not empty sq*/ {
							// if sq is not empty but is occupied by an enemy piece
							if ((is_white(board[sq.rank][sq.file]) && turn == "BLACK") || (is_black(board[sq.rank][sq.file]) && turn == "WHITE")) {
								var move = new Move(
									{rank:r,file:f},
									{rank:sq.rank,file:sq.file},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:sq.rank,file:sq.file},
										piece,
										board),
									null);
								moves.push(move);
							}
							// end loop
							break;
						}
					}
				} else if (piece == 'P' || piece == 'p') {
					// PAWN
					if (is_white(piece)) {
						// if on 2nd rank
						if (r == 1) {
							// if third rank sq in front of pawn is empty
							if (board[2][f] == null) {
								// if fourth rank sq in front of pawn is empty
								if (board[3][f] == null) {
									// add pawn move two sq to moves array
									var move = new Move(
										{rank:r,file:f},
										{rank:3,file:f},
										piece,
										get_position_after_move_on_board(
											{rank:r,file:f},
											{rank:3,file:f},
											piece,
											board),
										null);
									moves.push(move);
								}
							}
						}
						// if on any rank except 7th or 8th
						if (r != 7 && r != 6) {
							// if no piece in front of pawn
							if (board[r+1][f] == null) {
								// add pawn moves one sq to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f},
										piece,
										board),
									null);
								moves.push(move);
							}
							// if enemy piece exists to the right diagonal
							if (board[r+1][f+1] != null && is_black(board[r+1][f+1])) {
								// add capture to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f+1},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f+1},
										piece,
										board),
									null);
								moves.push(move);
							}
							// if enemy piece exists to the left diagonal
							if (board[r+1][f-1] != null && is_black(board[r+1][f-1])) {
								// add capture to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f-1},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f-1},
										piece,
										board),
									null);
								moves.push(move);
							}
						}
						// if on the 7th rank
						if (r == 6) {
							// if no piece in front of pawn
							if (board[r+1][f]) {
								// add pawn moves one sq to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f},
									'Q',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f},
										'Q',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f},
									'B',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f},
										'B',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f},
									'N',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f},
										'N',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f},
									'R',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f},
										'R',
										board),
									null);
								moves.push(move);
							}
							// if enemy piece exists to the right diagonal
							if (board[r+1][f+1] != null && is_black(board[r+1][f+1])) {
								// add capture to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f+1},
									'Q',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f+1},
										'Q',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f+1},
									'B',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f+1},
										'B',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f+1},
									'N',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f+1},
										'N',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f+1},
									'R',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f+1},
										'R',
										board),
									null);
								moves.push(move);
							}
							// if enemy piece exists to the left diagonal
							if (board[r-1][f+1] != null && is_black(board[r-1][f+1])) {
								// add capture to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f+1},
									'Q',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f+1},
										'Q',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f+1},
									'B',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f+1},
										'B',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f+1},
									'N',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f+1},
										'N',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f+1},
									'R',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f+1},
										'R',
										board),
									null);
								moves.push(move);
							}
						}
						// check en passant sqs
						if (get_en_passant_sq(fen) != null) {
							// console.log(get_en_passant_sq(fen));
							if (get_en_passant_sq(fen).rank == r+1 && get_en_passant_sq(fen).file == f+1) {
								// add en passant move to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f+1},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f+1},
										piece,
										board),
									null);
								moves.push(move);
							}
							if (get_en_passant_sq(fen).rank == r+1 && get_en_passant_sq(fen).file == f-1) {
								// add en passant move to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r+1,file:f-1},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r+1,file:f-1},
										piece,
										board),
									null);
								moves.push(move);
							}
						}
					} else /*is_black*/ {
						// if on 7th rank
						if (r == 6) {
							// if sixth rank sq in front of pawn is empty
							if (board[5][f] == null) {
								// if fifth rank sq in front of pawn is empty
								if (board[4][f] == null) {
									// add pawn move two sq to moves array
									var move = new Move(
										{rank:r,file:f},
										{rank:4,file:f},
										piece,
										get_position_after_move_on_board(
											{rank:r,file:f},
											{rank:4,file:f},
											piece,
											board),
										null);
									moves.push(move);
								}
							}
						}
						// if on any rank except 1st or 2nd
						if (r != 0 && r != 1) {
							// if no piece in front of pawn
							if (board[r-1][f] == null) {
								// add pawn moves one sq to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f},
										piece-
										board),
									null);
								moves.push(move);
							}
							// if enemy piece exists to the right diagonal
							if (board[r-1][f+1] != null && is_black(board[r-1][f+1])) {
								// add capture to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f+1},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f+1},
										piece,
										board),
									null);
								moves.push(move);
							}
							// if enemy piece exists to the left diagonal
							if (board[r-1][f-1] != null && is_black(board[r-1][f-1])) {
								// add capture to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f-1},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f-1},
										piece,
										board),
									null);
								moves.push(move);
							}
						}
						// if on the 2nd rank
						if (r == 1) {
							// if no piece in front of pawn
							if (board[r-1][f]) {
								// add pawn moves one sq to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f},
									'q',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f},
										'q',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f},
									'b',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f},
										'b',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f},
									'n',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f},
										'n',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f},
									'r',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f},
										'r',
										board),
									null);
								moves.push(move);
							}
							// if enemy piece exists to the right diagonal
							if (board[r-1][f+1] != null && is_black(board[r-1][f+1])) {
								// add capture to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f+1},
									'q',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f+1},
										'q',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f+1},
									'b',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f+1},
										'b',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f+1},
									'n',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f+1},
										'n',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f+1},
									'r',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f+1},
										'r',
										board),
									null);
								moves.push(move);
							}
							// if enemy piece exists to the left diagonal
							if (board[r-1][f-1] != null && is_black(board[r-1][f-1])) {
								// add capture to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f-1},
									'q',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f-1},
										'q',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f-1},
									'b',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f-1},
										'b',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f-1},
									'n',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f-1},
										'n',
										board),
									null);
								moves.push(move);
								move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f-1},
									'r',
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f-1},
										'r',
										board),
									null);
								moves.push(move);
							}
						}
						// check en passant sqs
						if (get_en_passant_sq(fen) != null) {
							if (get_en_passant_sq(fen).rank == r-1 && get_en_passant_sq(fen).file == f+1) {
								// add en passant move to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f+1},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f+1},
										piece,
										board),
									null);
								moves.push(move);
							}
							if (get_en_passant_sq(fen).rank == r-1 && get_en_passant_sq(fen).file == f-1) {
								// add en passant move to moves array
								var move = new Move(
									{rank:r,file:f},
									{rank:r-1,file:f-1},
									piece,
									get_position_after_move_on_board(
										{rank:r,file:f},
										{rank:r-1,file:f-1},
										piece,
										board),
									null);
								moves.push(move);
							}
						}
					}
				}
			}
		}
	}
	console.log(moves);
	for (var a = 0; a < moves.length; a++) {
		// print move data for testing
		print_move(moves[a]);
	}

	return moves;
}
function get_piece(board,sq) {
	/*returns the piece at sq on Game.board*/
	return board[sq.x][sq.y];
}
function get_position_after_move_on_board(src,dest,piece,board) {
	/*returns a board array created from the moving the piece from src to dest on the board param*/
	var board_after_move = [
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null],
	[null,null,null,null,null,null,null,null]
	];
	// copy board
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			board_after_move[i][j] = board[i][j];
		}
	}
	// replace dest with src piece
	board_after_move[dest.rank][dest.file] = piece;
	// replace src with null
	board_after_move[src.rank][src.file] = null;
	return board_after_move;
}
function get_square(rank,file) {
	/*returns the string form of the square when given a rank and file numerical param*/
	var sq = "";
	// convert numerical file to letter
	switch (file) {
		case 0: sq += 'a'; break;
		case 1: sq += 'b'; break;
		case 2: sq += 'c'; break;
		case 3: sq += 'd'; break;
		case 4: sq += 'e'; break;
		case 5: sq += 'f'; break;
		case 6: sq += 'g'; break;
		case 7: sq += 'h'; break;
		default: console.log("ERR :: sq out of range");
	}
	// add on the rank
	sq += rank+1;
	return sq;
}
function get_string_coord(coord) {
	/*returns the coord in string form*/
	return "("+coord.rank+","+coord.file+")";
}
function get_turn(fen) {
	/*gets the color of the player next to move*/
	var i = 0;
	// loops past the board
	while (fen.charAt(i) != ' ') {
		i++;
	}
	// check which color is in fen
	if (fen.charAt(i+1) == 'w') {
		return "WHITE";
	} else if (fen.charAt(i+1) == 'b') {
		return "BLACK";
	}
	throw "invalid color in fen";
}

function is_black(piece) {
	/*returns true if this piece is black*/
	if (piece == piece.toLowerCase()) {
		return true;
	}
	return false;
}
function is_white(piece) {
	/*returns true if this piece is white*/
	if (piece == piece.toUpperCase()) {
		return true;
	}
	return false;
}
function is_sq_threatened_by(board,sq,color) {
	/*returns a boolean result if sq on board is threatened by color*/
	var piece = null;
	var list = [];
	// checking king threats
	list.push({x:sq.x+1,y:sq.y});
	list.push({x:sq.x+1,y:sq.y+1});
	list.push({x:sq.x+1,y:sq.y-1});
	list.push({x:sq.x-1,y:sq.y});
	list.push({x:sq.x-1,y:sq.y+1});
	list.push({x:sq.x-1,y:sq.y-1});
	list.push({x:sq.x,y:sq.y+1});
	list.push({x:sq.x,y:sq.y-1});
	for (var i = 0; i < list.length; i++) {
		if (list[i].x > -1 && list[i].x < 8 && list[i].y > -1 && list[i].y < 8) {
			try {
				piece = board[list[i].x][list[i].y];
				if ((color == "WHITE" && piece == "K") || (color == "BLACK" && piece == "k")) {
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
	list.push({x:sq.x+1,y:sq.y+2});
	list.push({x:sq.x+1,y:sq.y-2});
	list.push({x:sq.x+2,y:sq.y+1});
	list.push({x:sq.x+2,y:sq.y-1});
	list.push({x:sq.x-1,y:sq.y+2});
	list.push({x:sq.x-1,y:sq.y-2});
	list.push({x:sq.x-2,y:sq.y+1});
	list.push({x:sq.x-2,y:sq.y-1});
	for (var i = 0; i < list.length; i++) {
		if (list[i].x > -1 && list[i].x < 8 && list[i].y > -1 && list[i].y < 8) {
			try {
				piece = board[list[i].x][list[i].y];
				if ((color == "WHITE" && piece == "N") || (color == "BLACK" && piece == "n")) {
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
			if ((color == "WHITE" && (piece == "R" || piece == "Q")) || (color == "BLACK" && (piece == "r" || piece == "q"))) {
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
			if ((color == "WHITE" && (piece == "R" || piece == "Q")) || (color == "BLACK" && (piece == "r" || piece == "q"))) {
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
			if ((color == "WHITE" && (piece == "R" || piece == "Q")) || (color == "BLACK" && (piece == "r" || piece == "q"))) {
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
			if ((color == "WHITE" && (piece == "R" || piece == "Q")) || (color == "BLACK" && (piece == "r" || piece == "q"))) {
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
			if ((color == "WHITE" && (piece == "B" || piece == "Q")) || (color == "BLACK" && (piece == "b" || piece == "q"))) {
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
			if ((color == "WHITE" && (piece == "B" || piece == "Q")) || (color == "BLACK" && (piece == "b" || piece == "q"))) {
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
			if ((color == "WHITE" && (piece == "B" || piece == "Q")) || (color == "BLACK" && (piece == "b" || piece == "q"))) {
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
			if ((color == "WHITE" && (piece == "B" || piece == "Q")) || (color == "BLACK" && (piece == "b" || piece == "q"))) {
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
			if (piece == 'P') {
				return true;
			}
		} catch(e) {
			// console.log(e.message);
		}
		try {
			piece = board[sq.x-1][sq.y+1];
			if (piece == 'P') {
				return true;
			}
		} catch(e) {
			// console.log(e.message);
		}
	} else if (color == "BLACK") {
		try {
			piece = board[sq.x+1][sq.y-1];
			if (piece == 'p') {
				return true;
			}
		} catch(e) {
			// console.log(e.message);
		}
		try {
			piece = board[sq.x+1][sq.y+1];
			if (piece == 'p') {
				return true;
			}
		} catch(e) {
			// console.log(e.message);
		}
	}
	// return false if none of the above conditions have led to a returning true
	return false;
}
function print_board_from_fen(fen) {
	/*prints the board in the console that reflects the fen*/
	var string = "";
	var i = 0;
	while (fen.charAt(i) != ' ') {
		// if the char is a slash
		if (fen.charAt(i) == '/') {
			// add a newline and a tab to go to the next rank
			string += "\n\t";
		}
		// if the char is a piece
		if (fen.charAt(i) == 'k' || fen.charAt(i) == 'q' || fen.charAt(i) == 'b' || fen.charAt(i) == 'n' || fen.charAt(i) == 'r' || fen.charAt(i) == 'p' || fen.charAt(i) == 'K' || fen.charAt(i) == 'Q' || fen.charAt(i) == 'B' || fen.charAt(i) == 'N' || fen.charAt(i) == 'R' || fen.charAt(i) == 'P') {
			// add the piece to the string
			string += fen.charAt(i);
		}
		// if the char is a number
		if (parseInt(fen.charAt(i)) < 9) {
			for (var j = parseInt(fen.charAt(i)); j > -1; j--) {
				// add space to string
				string += ' ';
			}
		}
		// increment the char we read
		i++;
	}
	// return the board as a string
	return string;
}

function print_game_info(g) {
	/*prints all the information about the current state of Game 'g' into the console*/
	console.log(g.gametype+" GAME : "+g.white+" vs "+g.black);
	console.log("\t"+g.fen);
	console.log("\t"+print_board_from_fen(g.fen));
	console.log("\t"+get_turn(g.fen)+"'s turn");
	console.log("\tavailable castles : "+get_castling_data(g.fen));
	console.log("\tPGN : ");
	var legal_moves = get_legal_moves(g.fen);
	console.log("\t"+legal_moves.length+" legal moves");

}
function print_move(move) {
	/*prints all the information of move*/
	console.log(move.notation);
	console.log(get_string_coord(move.src)+" --> "+get_string_coord(move.dest)+" = "+move.piece);
}


/*IMAGES*/
var IMAGES = {wPawn:new Image(),wRook:new Image(),wKnight:new Image(),wBishop:new Image(),wQueen:new Image(),wKing:new Image(),bPawn:new Image(),bRook:new Image(),bKnight:new Image(),bBishop:new Image(),bQueen:new Image(),bKing:new Image(),arrow:new Image(),shaft:new Image()};

IMAGES.wPawn.src = "./assets/pieces/w_Pawn.png";
IMAGES.wRook.src = "./assets/pieces/w_Rook.png";
IMAGES.wKnight.src = "./assets/pieces/w_Knight.png";
IMAGES.wBishop.src = "./assets/pieces/w_Bishop.png";
IMAGES.wQueen.src = "./assets/pieces/w_Queen.png";
IMAGES.wKing.src = "./assets/pieces/w_King.png";
IMAGES.bPawn.src = "./assets/pieces/b_Pawn.png";
IMAGES.bRook.src = "./assets/pieces/b_Rook.png";
IMAGES.bKnight.src = "./assets/pieces/b_Knight.png";
IMAGES.bBishop.src = "./assets/pieces/b_Bishop.png";
IMAGES.bQueen.src = "./assets/pieces/b_Queen.png";
IMAGES.bKing.src = "./assets/pieces/b_King.png";
IMAGES.arrow.src = "./assets/arrow.png";
IMAGES.shaft.src = "./assets/shaft.png";