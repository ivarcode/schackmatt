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

function print_game_info(g) {
	/*prints all the information about the current state of Game 'g' into the console*/
	console.log(g.gametype+" GAME : "+g.white+" vs "+g.black);
	console.log("\t"+g.fen);
	console.log("\t"+print_board_from_fen(g.fen));
	console.log("\t"+get_turn(g.fen)+"'s turn");
	console.log("\tavailable castles : "+get_castling_data(g.fen));

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


/* PIECE */

/*Piece object constructor
used as the object to store all the data associated with a 'piece' i.e. type, color*/
function Piece(type, color) {
	this.type = type;
	this.color = color;
}


/* MOVE */

/*Move object constructor
used as the object to store all the data associated with a 'move' calculation i.e. src, dest, piece, position*/
function Move(src, dest, piece, position) {
	this.src = src;
	this.dest = dest;
	this.piece = piece;
	this.position = position;
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