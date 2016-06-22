/*
rules.js
*/

function isLegalMove(game,src,dest) {
	var moves = getLegalMoves(game);
	for (var i = 0; i < moves.length; i++) {
		if (moves[i].src.x == src.x && moves[i].src.y == src.y &&
			moves[i].dest.x == dest.x && moves[i].dest.y == dest.y) {
			console.log("is legal move");
			return true;
		}
	}
	return false;
}

function getLegalMoves(game) {
	var moves = [];
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (game.turn = "WHITE") {
				if (game.board[i][j].color == "WHITE") {
					moves.concat(getMovesFromSq({x:i,y:j},game));
				}
			} else /*black turn*/{
				if (game.board[i][j].color == "BLACK") {
					moves.concat(getMovesFromSq({x:i,y:j},game));
				}
			}
		}
	}
	console.log("legal moves length = " + moves.length);
	return moves;
}

function getMovesFromSq(sq,game) {
	console.log("getMovesFromSq " + sq.x + "," + sq.y);
	var piece = game.board[sq.x][sq.y];
	console.log(piece.color + " " + piece.type);
	if (piece.type == "KING") {
		return getKingMoves(sq,game);
	}
}

function getKingMoves(sq,game) {
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
			moves[moves.length] = new move(sq,list[i],getNotation(sq,list[i],game));
		}
	}
	console.log("king moves length = " + moves.length);
	return moves;
}

function getNotation(src,dest,game) {
	var notation = "";
	var piece = game.board[7-dest.y][dest.x];
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
	return notation;
}

function pairToSq(sq) {
	var square = "";
	switch (sq.x) {
		case 0: square += "a"; break;
		case 1: square += "b"; break;
		case 2: square += "c"; break;
		case 3: square += "d"; break;
		case 4: square += "e"; break;
		case 5: square += "f"; break;
		case 6: square += "g"; break;
		case 7: square += "h"; break;
		default: console.log("sq out of range error");
	}
	square += 8-sq.y;
	return square;
}