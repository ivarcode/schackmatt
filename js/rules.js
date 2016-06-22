/*
rules.js
*/

function isLegalMove(game,src,dest) {
	var moves = getLegalMoves(game);
	// console.log("move " + src.x + "," + src.y + " --> " + dest.x + "," + dest.y);
	// console.log("number of legal moves = " + moves.length);
	for (var i = 0; i < moves.length; i++) {
		// console.log(moves[i].src.x + "," + moves[i].src.y + " --> " + moves[i].dest.x + "," + moves[i].dest.y);
		if (moves[i].src.x == src.x && moves[i].src.y == src.y &&
			moves[i].dest.x == dest.x && moves[i].dest.y == dest.y) {
			// console.log("is legal move");
			return true;
		}
	}
	return false;
}

function getLegalMoves(game) {
	var moves = [];
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			try {
				if (game.board[i][j].color == game.turn) {
					var a = getMovesFromSq({x:i,y:j},game);
					for (var b = 0; b < a.length; b++) {
						moves[moves.length] = a[b];
					}
				}
			} catch(e) {
				// console.log("ERR :: " + e.message);
			}
		}
	}
	// console.log("legal moves length = " + moves.length);
	return moves;
}

function getMovesFromSq(sq,game) {
	// console.log("getMovesFromSq " + sq.x + "," + sq.y);
	var piece = game.board[sq.x][sq.y];
	// console.log(piece.color + " " + piece.type);
	if (piece.type == "KING") {
		// console.log("piece.type == KING");
		return getKingMoves(sq,game);
	}
	return [];
}

function getKingMoves(sq,game) {
	// console.log("getKingMoves sq = " + sq.x + "," + sq.y);
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
	// console.log(moves.length + " moves length");
	// console.log(list.length + " list length");
	for (var i = 0; i < list.length; i++) {
		if (list[i].x > -1 && list[i].x < 8 && list[i].y > -1 && list[i].y < 8) {
			// console.log("adding new move to the moves [] ");
			// console.log(moves.length);
			moves[moves.length] = {src:sq,dest:list[i],notation:null};
			// console.log(moves.length);
		}
	}
	// moves[moves.length] = new move(sq,sq,getNotation(sq,sq,game));
	// console.log("king moves length = " + moves.length);
	return moves;
}

function getNotation(src,dest,game) {
	var notation = "";
	var piece = game.board[dest.x][dest.y];
	// console.log(piece.color + " " + piece.type);
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

	notation += pairToSq(dest);
	// console.log("NOTATION = " + notation);
	return notation;
}

function pairToSq(sq) {
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