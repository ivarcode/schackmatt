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

				} else if (piece == 'P' || piece == 'p') {
					// PAWN

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
function get_string_coord(coord) {
	/*returns the coord in string form*/
	return "("+coord.rank+","+coord.file+")";
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

IMAGES.wPawn.src = "./img/pieces/w_Pawn.png";
IMAGES.wRook.src = "./img/pieces/w_Rook.png";
IMAGES.wKnight.src = "./img/pieces/w_Knight.png";
IMAGES.wBishop.src = "./img/pieces/w_Bishop.png";
IMAGES.wQueen.src = "./img/pieces/w_Queen.png";
IMAGES.wKing.src = "./img/pieces/w_King.png";
IMAGES.bPawn.src = "./img/pieces/b_Pawn.png";
IMAGES.bRook.src = "./img/pieces/b_Rook.png";
IMAGES.bKnight.src = "./img/pieces/b_Knight.png";
IMAGES.bBishop.src = "./img/pieces/b_Bishop.png";
IMAGES.bQueen.src = "./img/pieces/b_Queen.png";
IMAGES.bKing.src = "./img/pieces/b_King.png";
IMAGES.arrow.src = "./img/arrow.png";
IMAGES.shaft.src = "./img/shaft.png";