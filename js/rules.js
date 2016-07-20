/*
rules.js
*/

function getOppColor(color) {
	/*returns the color that is not the input color, white -> black, black -> white*/
	if (color == "WHITE") {
		return "BLACK";
	} else if (color == "BLACK") {
		return "WHITE";
	} else {
		// console.log("getOppColor() :: not a valid color");
	}
}
function pairToSq(sq) {
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
function getNotation(move,piece) {
	/*returns a string containing the notation of the move in game*/
	var notation = "";
	if (piece == null) {
		return null;
	}
	if (piece.type == "KING") {
		notation += "K";
	} else if (piece.type == "QUEEN") {
		notation += "Q";
	} else if (piece.type == "BISHOP") {
		notation += "B";
	} else if (piece.type == "KNIGHT") {
		notation += "N";
	} else if (piece.type == "ROOK") {
		notation += "R";
	} else {
		//add nothing
	}
	if (game.get_piece(move.dest) != null) {
		notation += "x";
	}
	notation += pairToSq(move.dest);
	if (game.game_after_move(move).is_checkmate()) {
		notation += "#";
	} else if (game.game_after_move(move).is_check()) {
		notation += "+";
	}
	return notation;
}

function locateKing(color,game) {
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
}




