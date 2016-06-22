/*
rules.js
*/

function isLegalMove(game,src,dest) {
	var moves = getLegalMoves(game);
	console.log("move " + src.x + "," + src.y + " --> " + dest.x + "," + dest.y);
	console.log("number of legal moves = " + moves.length);
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
	removeChecks(moves,game);
	return moves;
}

/*function removes moves from the list that put the player in game in self-check
edits moves object directly
*/
function removeChecks(moves, game) {
	for (var i = 0; i < moves.length; i++) {
		var g = {p1:null,p2:null,board:null,turn:game.turn,record:null,move_count:null,enPassant_allowedAt:game.enPassant_allowedAt};
		g.board = [];
		for (var x = 0; x < 8; x++) {
			g.board[x] = [];
		}
		for (var a = 0; a < 8; a++) {
			for (var b = 0; b < 8; b++) {
				g.board[a][b] = game.board[a][b];
			}
		}
		// console.log("turn is copying " + game.turn);
		/*if (game.turn == "WHITE") {
			g.turn == "WHITE";
		} else { g.turn == "BLACK" }*/
		// printGame(g);
		movePiece(moves[i].src,moves[i].dest,g);
		// printGame(g);
		var sq = null;
		for (var a = 0; a < 8; a++) {
			for (var b = 0; b < 8; b++) {
				if (g.board[a][b] != null && g.board[a][b].type == "KING" && g.board[a][b].color == g.turn) {
					sq = {x:a,y:b};
					break;
				}
			}
		}
		if (sq == null) {
			console.log("no king found on board for " + game.turn);
		}
		// console.log("sq == " + sq.x + "," + sq.y);
		// printGame(g);
		// removing move
		if (isPieceThreatened(sq,g)) { 
			// console.log("splicing " + sq.x + "," + sq.y);
			moves.splice(i,1);
			i--;
		}
	}
}

/*function detects whether the piece on sq is threatened by a piece on the opposing side*/
function isPieceThreatened(sq,game) {
	// console.log("isPieceThreatened(sq = " + sq.x + "," + sq.y + " , game)");
	// printGame(game);
	var moves = [];
	moves = getKnightMoves(sq,game);
	for (var i = 0; i < moves.length; i++) {
		try {
			// console.log("trying move " + moves[i].src.x + "," + moves[i].src.y + " --> " + moves[i].dest.x + "," + moves[i].dest.y);
			// console.log(game.board[moves[i].dest.x][moves[i].dest.y].type + game.board[moves[i].dest.x][moves[i].dest.y].color);
		} catch(e) {
			console.log("ERR :: " + e.message);
		}
		if (game.board[moves[i].dest.x][moves[i].dest.y] != null && game.board[moves[i].dest.x][moves[i].dest.y].type == "KNIGHT") {
			// console.log(game.board[moves[i].dest.x][moves[i].dest.y].color + " == " + game.turn);
			if (game.board[moves[i].dest.x][moves[i].dest.y].color != game.turn) {
				// console.log("true");
				return true;
			}
		}
	}
	moves = getBishopMoves(sq,game);
	for (var i = 0; i < moves.length; i++) {
		if (game.board[moves[i].dest.x][moves[i].dest.y] != null && ((game.board[moves[i].dest.x][moves[i].dest.y].type == "BISHOP") || (game.board[moves[i].dest.x][moves[i].dest.y].type == "QUEEN"))) {
			// console.log(game.board[moves[i].dest.x][moves[i].dest.y].color + " == " + game.turn);
			if (game.board[moves[i].dest.x][moves[i].dest.y].color != game.turn) {
				// console.log("true");
				return true;
			}
		}
	}
	moves = getRookMoves(sq,game);
	for (var i = 0; i < moves.length; i++) {
		if (game.board[moves[i].dest.x][moves[i].dest.y] != null && ((game.board[moves[i].dest.x][moves[i].dest.y].type == "ROOK") || (game.board[moves[i].dest.x][moves[i].dest.y].type == "QUEEN"))) {
			// console.log(game.board[moves[i].dest.x][moves[i].dest.y].color + " == " + game.turn);
			if (game.board[moves[i].dest.x][moves[i].dest.y].color != game.turn) {
				// console.log("true");
				return true;
			}
		}
	}
	moves = getKingMoves(sq,game);
	for (var i = 0; i < moves.length; i++) {
		if (game.board[moves[i].dest.x][moves[i].dest.y] != null && game.board[moves[i].dest.x][moves[i].dest.y].type == "KING") {
			// console.log(game.board[moves[i].dest.x][moves[i].dest.y].color + " == " + game.turn);
			if (game.board[moves[i].dest.x][moves[i].dest.y].color != game.turn) {
				// console.log("true");
				return true;
			}
		}
	}
	if (game.turn == "WHITE") {
		try {
			if (game.board[sq.x+1][sq.y+1].type == "PAWN" && game.board[sq.x+1][sq.y+1].color != game.turn) {
				return true;
			}
		} catch(e) {
			console.log("ERR :: " + e.message);
		}
		try {
			if (game.board[sq.x+1][sq.y-1].type == "PAWN" && game.board[sq.x+1][sq.y-1].color != game.turn) {
				return true;
			}
		} catch(e) {
			console.log("ERR :: " + e.message);
		}
	} else /*turn == BLACK*/{
		try {
			if (game.board[sq.x+1][sq.y+1].type == "PAWN" && game.board[sq.x+1][sq.y+1].color != game.turn) {
				return true;
			}
		} catch(e) {
			console.log("ERR :: " + e.message);
		}
		try {
			if (game.board[sq.x+1][sq.y-1].type == "PAWN" && game.board[sq.x+1][sq.y-1].color != game.turn) {
				return true;
			}
		} catch(e) {
			console.log("ERR :: " + e.message);
		}
	}
	// console.log("false");
	return false;
}

function getMovesFromSq(sq,game) {
	// console.log("getMovesFromSq " + sq.x + "," + sq.y);
	var piece = game.board[sq.x][sq.y];
	if (piece == null) {
		return [];
	}
	// console.log(piece.color + " " + piece.type);
	if (piece.type == "KING") {
		return getKingMoves(sq,game);
	} else if (piece.type == "QUEEN") {
		return getQueenMoves(sq,game);
	} else if (piece.type == "BISHOP") {
		return getBishopMoves(sq,game);
	} else if (piece.type == "KNIGHT") {
		return getKnightMoves(sq,game);
	} else if (piece.type == "ROOK") {
		return getRookMoves(sq,game);
	} else if (piece.type == "PAWN") {
		return getPawnMoves(sq,game);
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
			if (game.board[list[i].x][list[i].y] == null || game.board[list[i].x][list[i].y].color != game.turn) {
				moves[moves.length] = {src:sq,dest:list[i],notation:null};
			}
			// console.log(moves.length);
		}
	}
	// moves[moves.length] = new move(sq,sq,getNotation(sq,sq,game));
	// console.log("king moves length = " + moves.length);
	return moves;
}

function getKnightMoves(sq,game) {
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
			if (game.board[list[i].x][list[i].y] == null || game.board[list[i].x][list[i].y].color != game.turn) {
				moves[moves.length] = {src:sq,dest:list[i],notation:null};
			}
		}
	}
	return moves;
}

function getPawnMoves(sq,game) {
	console.log("getPawnMoves...");
	var moves = [];
	if (game.turn == "WHITE") {
		if (game.board[sq.x+1][sq.y] == null) {
			// console.log("" + sq.x + "," + sq.y + " --> " + (sq.x+1) + "," + sq.y);
			moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y},notation:null};
		}
		if (sq.x == 1 && game.board[sq.x+2][sq.y] == null && game.board[sq.x+1][sq.y] == null) {
			moves[moves.length] = {src:sq,dest:{x:sq.x+2,y:sq.y},notation:null};
		}
		if (sq.x+1 < 8 && sq.y+1 < 8 && game.board[sq.x+1][sq.y+1] != null && game.board[sq.x+1][sq.y+1].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y+1},notation:null};
		}
		if (sq.x+1 < 8 && sq.y-1 > -1 && game.board[sq.x+1][sq.y-1] != null && game.board[sq.x+1][sq.y-1].color != game.turn) {
			// console.log("" + sq.x + "," + sq.y + " --> " + (sq.x+1) + "," + (sq.y-1));
			moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y-1},notation:null};
		}
		if (game.enPassant_allowedAt != null) {
			if (game.enPassant_allowedAt.x == sq.x+1 && game.enPassant_allowedAt.y == sq.y+1) {
				moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y+1},notation:null};
			} else if (game.enPassant_allowedAt.x == sq.x+1 && game.enPassant_allowedAt.y == sq.y-1) {
				moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y-1},notation:null};
			}
		}
	} else /*if turn == BLACK*/{
		if (game.board[sq.x-1][sq.y] == null) {
			// console.log("" + sq.x + "," + sq.y + " --> " + (sq.x+1) + "," + sq.y);
			moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y},notation:null};
		}
		if (sq.x == 6 && game.board[sq.x-2][sq.y] == null && game.board[sq.x-1][sq.y] == null) {
			moves[moves.length] = {src:sq,dest:{x:sq.x-2,y:sq.y},notation:null};
		}
		if (sq.x-1 < 8 && sq.y+1 < 8 && game.board[sq.x-1][sq.y+1] != null && game.board[sq.x-1][sq.y+1].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y+1},notation:null};
		}
		if (sq.x-1 < 8 && sq.y-1 > -1 && game.board[sq.x-1][sq.y-1] != null && game.board[sq.x-1][sq.y-1].color != game.turn) {
			// console.log("" + sq.x + "," + sq.y + " --> " + (sq.x+1) + "," + (sq.y-1));
			moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y-1},notation:null};
		}
		if (game.enPassant_allowedAt != null) {
			if (game.enPassant_allowedAt.x == sq.x-1 && game.enPassant_allowedAt.y == sq.y+1) {
				moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y+1},notation:null};
			} else if (game.enPassant_allowedAt.x == sq.x-1 && game.enPassant_allowedAt.y == sq.y-1) {
				moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y-1},notation:null};
			}
		}
	}
	console.log("getPawnMoves length " + moves.length);
	return moves;
}

function getQueenMoves(sq,game) {
	var moves = [];
	var a = sq.x;
	var b = sq.y;
	while (a+1 < 8) {
		a++;
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	a = sq.x;
	b = sq.y;
	while (a+1 < 8 && b+1 < 8) {
		a++;
		b++;
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	return moves;
}

function getRookMoves(sq,game) {
	var moves = [];
	var a = sq.x;
	var b = sq.y;
	while (a+1 < 8) {
		a++;
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	return moves;
}

function getBishopMoves(sq,game) {
	var moves = [];
	var a = sq.x;
	var b = sq.y;
	while (a+1 < 8 && b+1 < 8) {
		a++;
		b++;
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
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
		if (game.board[a][b] == null || game.board[a][b].color != game.turn) {
			moves[moves.length] = {src:sq,dest:{x:a,y:b},notation:null};
			if (game.board[a][b] != null) {
				break;
			}
		} else {
			break;
		}
	}
	return moves;
}

function getNotation(src,dest,game) {
	var notation = "";
	var piece = game.board[src.x][src.y];
	if (piece == null) {
		return null;
	}
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
	if (game.board[dest.x][dest.y] != null) {
		notation += "x";
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