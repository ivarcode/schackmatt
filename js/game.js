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
			// if piece is not null AND (if piece is uppercase and turn == white OR if piece is lowercase and turn == black)
			if (piece != null && ((piece == piece.toUpperCase() && turn == "WHITE") || (piece == piece.toLowerCase() && turn == "BLACK"))) {
				console.log(piece);
				if (piece == 'K' || piece == 'k') {
					// KING

				} else if (piece == 'Q' || piece == 'q') {
					// QUEEN

				} else if (piece == 'B' || piece == 'b') {
					// BISHOP

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
							if (board[sqs[i].rank][sqs[i].file] == null || ((board[sqs[i].rank][sqs[i].file] == board[sqs[i].rank][sqs[i].file].toUpperCase() && turn == "BLACK") || (board[sqs[i].rank][sqs[i].file] == board[sqs[i].rank][sqs[i].file].toLowerCase() && turn == "WHITE"))) {
								// add move to moves array
								var move = "";
								// add N for knight
								move += 'N';
								// getting other sqs that can move to the same place to check if another knight can go to the sqs[i] in which case we need to identify that in the move notation
								var file_identifier = false;
								var rank_identifier = false;
								var sqs_2 = [];
								sqs_2.push({rank:sqs[i].rank+2,file:sqs[i].file+1});
								sqs_2.push({rank:sqs[i].rank+2,file:sqs[i].file-1});
								sqs_2.push({rank:sqs[i].rank+1,file:sqs[i].file+2});
								sqs_2.push({rank:sqs[i].rank+1,file:sqs[i].file-2});
								sqs_2.push({rank:sqs[i].rank-2,file:sqs[i].file+1});
								sqs_2.push({rank:sqs[i].rank-2,file:sqs[i].file-1});
								sqs_2.push({rank:sqs[i].rank-1,file:sqs[i].file+2});
								sqs_2.push({rank:sqs[i].rank-1,file:sqs[i].file-2});
								// loop through sqs_2
								for (var j = 0; j < sqs_2.length; j++) {
									// if sq is on board && if sq != the loc of piece we are already moving
									if (sqs_2[j].rank < 8 && sqs_2[j].rank > -1 && sqs_2[j].file < 8 && sqs_2[j].file > -1 && (sqs_2[j].rank != r || sqs_2[j].file != f)) {
										// if the piece at sqs_2[j] is the same color and is a knight
										if ((board[sqs_2[j].rank][sqs_2[j].file] == 'N' && turn == "WHITE") || (board[sqs_2[j].rank][sqs_2[j].file] == 'n' && turn == "BLACK")) {
											// if the files of the two pieces are the same, include the rank identifier, if the ranks are the same, include the file identifier
											if (sqs_2[j].file == f) {
												rank_identifier = true;
											}
											if (sqs_2[j].rank == r) {
												file_identifier = true;
											}
										}
									}
								}
								if (file_identifier) {
									switch (f) {
										case 0: move += 'a'; break;
										case 1: move += 'b'; break;
										case 2: move += 'c'; break;
										case 3: move += 'd'; break;
										case 4: move += 'e'; break;
										case 5: move += 'f'; break;
										case 6: move += 'g'; break;
										case 7: move += 'h'; break;
									}
								}
								if (rank_identifier) {
									move += r+1;
								}
								// if dest sq not empty
								if (board[sqs[i].rank][sqs[i].file] != null) {
									// add x for capture
									move += 'x';
								}
								// add square
								move += get_square(sqs[i].rank,sqs[i].file);
								// add move to moves array
								moves.push(move);
							}
						}
					}
				} else if (piece == 'R' || piece == 'r') {
					// ROOK

				} else if (piece == 'P' || piece == 'p') {
					// PAWN

				}
			}
		}
	}
	console.log(moves);

	return moves;
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
	console.log("\t"+legal_moves);

}