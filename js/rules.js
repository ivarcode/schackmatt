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
		console.log("getOppColor() :: not a valid color");
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

function isSqThreatenedBy(sq,color,game) {
	/*returns a boolean if the sq on Game is threatened by color*/
	var moves = [];
	var c = getOppColor(color);
	moves = getKnightMoves(sq,c,game);
	for (var i = 0; i < moves.length; i++) {
		if (game.board[moves[i].dest.x][moves[i].dest.y] != null && game.board[moves[i].dest.x][moves[i].dest.y].type == "KNIGHT" && game.board[moves[i].dest.x][moves[i].dest.y].color == color) {
			return true;
		}
	}
	moves = getBishopMoves(sq,c,game);
	for (var i = 0; i < moves.length; i++) {
		if (game.board[moves[i].dest.x][moves[i].dest.y] != null && ((game.board[moves[i].dest.x][moves[i].dest.y].type == "BISHOP") || (game.board[moves[i].dest.x][moves[i].dest.y].type == "QUEEN")) && game.board[moves[i].dest.x][moves[i].dest.y].color == color) {
			return true;
		}
	}
	moves = getRookMoves(sq,c,game);
	for (var i = 0; i < moves.length; i++) {
		if (game.board[moves[i].dest.x][moves[i].dest.y] != null && ((game.board[moves[i].dest.x][moves[i].dest.y].type == "ROOK") || (game.board[moves[i].dest.x][moves[i].dest.y].type == "QUEEN")) && game.board[moves[i].dest.x][moves[i].dest.y].color == color) {
			return true;
		}
	}
	if (color == "BLACK") {
		try {
			if (game.board[sq.x+1][sq.y+1].type == "PAWN" && game.board[sq.x+1][sq.y+1].color == color) {
				return true;
			}
		} catch(e) {
			// console.log("ERR :: " + e.message);
		}
		try {
			if (game.board[sq.x+1][sq.y-1].type == "PAWN" && game.board[sq.x+1][sq.y-1].color == color) {
				return true;
			}
		} catch(e) {
			// console.log("ERR :: " + e.message);
		}
	} else /*turn == WHITE*/{
		try {
			if (game.board[sq.x-1][sq.y+1].type == "PAWN" && game.board[sq.x-1][sq.y+1].color == color) {
				return true;
			}
		} catch(e) {
			// console.log("ERR :: " + e.message);
		}
		try {
			if (game.board[sq.x-1][sq.y-1].type == "PAWN" && game.board[sq.x-1][sq.y-1].color == color) {
				return true;
			}
		} catch(e) {
			// console.log("ERR :: " + e.message);
		}
	}
	moves = getKingMoves(sq,c,game);
	for (var i = 0; i < moves.length; i++) {
		if (game.board[moves[i].dest.x][moves[i].dest.y] != null && game.board[moves[i].dest.x][moves[i].dest.y].type == "KING" && game.board[moves[i].dest.x][moves[i].dest.y].color == color) {
			return true;
		}
	}
	return false;
}

/*get___Moves(sq,color,game) functions each return an array of moves for the color in game at sq*/
function getKingMoves(sq,color,game) {
	/*gets all moves from sq in game for the arg color king*/
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
			if (game.board[list[i].x][list[i].y] == null || game.board[list[i].x][list[i].y].color != color) {
				moves[moves.length] = {src:sq,dest:list[i],notation:null};
			}
		}
	}
	var c = getOppColor(color);
	if (!isSqThreatenedBy(sq,c,game)) {
		if (sq.x == 0 && sq.y == 4 && color == "WHITE" && game.castling[0] && game.board[sq.x][sq.y+1] == null && !isSqThreatenedBy({x:sq.x,y:sq.y+1},c,game) && game.board[sq.x][sq.y+2] == null && !isSqThreatenedBy({x:sq.x,y:sq.y+2},c,game)) {
			moves[moves.length] = {src:sq,dest:{x:sq.x,y:sq.y+2},notation:"0-0"};
			console.log("kingside castling allowed for white");
		}
		if (sq.x == 0 && sq.y == 4 && color == "WHITE" && game.castling[1] && game.board[sq.x][sq.y-1] == null && !isSqThreatenedBy({x:sq.x,y:sq.y-1},c,game) && game.board[sq.x][sq.y-2] == null && !isSqThreatenedBy({x:sq.x,y:sq.y-2},c,game) && game.board[sq.x][sq.y-3] == null) {
			moves[moves.length] = {src:sq,dest:{x:sq.x,y:sq.y-2},notation:"0-0-0"};
			console.log("queenside castling allowed for white");
		}
		if (sq.x == 7 && sq.y == 4 && color == "BLACK" && game.castling[2] && game.board[sq.x][sq.y+1] == null && !isSqThreatenedBy({x:sq.x,y:sq.y+1},c,game) && game.board[sq.x][sq.y+2] == null && !isSqThreatenedBy({x:sq.x,y:sq.y+2},c,game)) {
			moves[moves.length] = {src:sq,dest:{x:sq.x,y:sq.y+2},notation:"0-0"};
			console.log("kingside castling allowed for black");
		}
		if (sq.x == 7 && sq.y == 4 && color == "BLACK" && game.castling[3] && game.board[sq.x][sq.y-1] == null && !isSqThreatenedBy({x:sq.x,y:sq.y-1},c,game) && game.board[sq.x][sq.y-2] == null && !isSqThreatenedBy({x:sq.x,y:sq.y-2},c,game) && game.board[sq.x][sq.y-3] == null) {
			moves[moves.length] = {src:sq,dest:{x:sq.x,y:sq.y-2},notation:"0-0-0"};
			console.log("queenside castling allowed for black");
		}
	}
	return moves;
}
function getKnightMoves(sq,color,game) {
	/*gets all moves from sq in game for the arg color knight*/
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
			if (game.board[list[i].x][list[i].y] == null || game.board[list[i].x][list[i].y].color != color) {
				moves[moves.length] = {src:sq,dest:list[i],notation:null};
			}
		}
	}
	return moves;
}
function getQueenMoves(sq,color,game) {
	/*gets all moves from sq in game for the arg color queen*/
	var a = getRookMoves(sq,color,game);
	var b = getBishopMoves(sq,color,game);
	var moves = a.concat(b);
	return moves;
}
function getRookMoves(sq,color,game) {
	/*gets all moves from sq in game for the arg color rook*/
	var moves = [];
	var a = sq.x;
	var b = sq.y;
	while (a+1 < 8) {
		a++;
		if (game.board[a][b] == null || game.board[a][b].color != color) {
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
		if (game.board[a][b] == null || game.board[a][b].color != color) {
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
		if (game.board[a][b] == null || game.board[a][b].color != color) {
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
		if (game.board[a][b] == null || game.board[a][b].color != color) {
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
function getBishopMoves(sq,color,game) {
	/*gets all moves from sq in game for the arg color bishop*/
	var moves = [];
	var a = sq.x;
	var b = sq.y;
	while (a+1 < 8 && b+1 < 8) {
		a++;
		b++;
		if (game.board[a][b] == null || game.board[a][b].color != color) {
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
		if (game.board[a][b] == null || game.board[a][b].color != color) {
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
		if (game.board[a][b] == null || game.board[a][b].color != color) {
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
		if (game.board[a][b] == null || game.board[a][b].color != color) {
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
function getPawnMoves(sq,color,game) {
	/*gets all moves from sq in game for the arg color pawn*/
	var moves = [];
	if (color == "WHITE") {
		if (game.board[sq.x+1][sq.y] == null) {
			moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y},notation:null};
		}
		if (sq.x == 1 && game.board[sq.x+2][sq.y] == null && game.board[sq.x+1][sq.y] == null) {
			moves[moves.length] = {src:sq,dest:{x:sq.x+2,y:sq.y},notation:null};
		}
		if (sq.x+1 < 8 && sq.y+1 < 8 && game.board[sq.x+1][sq.y+1] != null && game.board[sq.x+1][sq.y+1].color != color) {
			moves[moves.length] = {src:sq,dest:{x:sq.x+1,y:sq.y+1},notation:null};
		}
		if (sq.x+1 < 8 && sq.y-1 > -1 && game.board[sq.x+1][sq.y-1] != null && game.board[sq.x+1][sq.y-1].color != color) {
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
			moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y},notation:null};
		}
		if (sq.x == 6 && game.board[sq.x-2][sq.y] == null && game.board[sq.x-1][sq.y] == null) {
			moves[moves.length] = {src:sq,dest:{x:sq.x-2,y:sq.y},notation:null};
		}
		if (sq.x-1 < 8 && sq.y+1 < 8 && game.board[sq.x-1][sq.y+1] != null && game.board[sq.x-1][sq.y+1].color != color) {
			moves[moves.length] = {src:sq,dest:{x:sq.x-1,y:sq.y+1},notation:null};
		}
		if (sq.x-1 < 8 && sq.y-1 > -1 && game.board[sq.x-1][sq.y-1] != null && game.board[sq.x-1][sq.y-1].color != color) {
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
	var m = [];
	for (var i = 0; i < moves.length; i++) {
		if (moves[i].dest.x == 7 || moves[i].dest.x == 0) {
			var n = "";
			if (moves[i].src.y != moves[i].dest.y) {
				n += "x";
			}
			n += pairToSq(moves[i].dest);
			moves[i].notation = n+"=N";
			m[m.length] = n+"=B";
			m[m.length] = n+"=R";
			m[m.length] = n+"=Q";
		}
	}
	moves.concat(m);
	return moves;
}
