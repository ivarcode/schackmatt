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

	
	return moves;
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