/*
board.js
*/

var NULL_PIECE = " ";
var WHITE_PIECES = {king:"K",queen:"Q",bishop:"B",knight:"N",rook:"R",pawn:"P"};
var BLACK_PIECES = {king:"k",queen:"q",bishop:"b",knight:"n",rook:"r",pawn:"p"};

var BOARD_STANDARD = [
[BLACK_PIECES.rook,BLACK_PIECES.knight,BLACK_PIECES.bishop,BLACK_PIECES.queen,BLACK_PIECES.king,BLACK_PIECES.bishop,BLACK_PIECES.knight,BLACK_PIECES.rook],
[BLACK_PIECES.pawn,BLACK_PIECES.pawn,BLACK_PIECES.pawn,BLACK_PIECES.pawn,BLACK_PIECES.pawn,BLACK_PIECES.pawn,BLACK_PIECES.pawn,BLACK_PIECES.pawn],
[NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE],
[NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE],
[NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE],
[NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE],
[WHITE_PIECES.pawn,WHITE_PIECES.pawn,WHITE_PIECES.pawn,WHITE_PIECES.pawn,WHITE_PIECES.pawn,WHITE_PIECES.pawn,WHITE_PIECES.pawn,WHITE_PIECES.pawn],
[WHITE_PIECES.rook,WHITE_PIECES.knight,WHITE_PIECES.bishop,WHITE_PIECES.queen,WHITE_PIECES.king,WHITE_PIECES.bishop,WHITE_PIECES.knight,WHITE_PIECES.rook]
];

var CHECK_TEST = [
[WHITE_PIECES.king,WHITE_PIECES.queen,NULL_PIECE,WHITE_PIECES.queen,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE],
[NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE],
[NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE],
[NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE],
[NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE],
[NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE],
[NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE],
[NULL_PIECE,NULL_PIECE,BLACK_PIECES.king,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE,NULL_PIECE]
];

var IMAGES = {wPawn:new Image(),wRook:new Image(),wKnight:new Image(),wBishop:new Image(),wQueen:new Image(),wKing:new Image(),bPawn:new Image(),bRook:new Image(),bKnight:new Image(),bBishop:new Image(),bQueen:new Image(),bKing:new Image()};

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




function getKingMoves(brd, src, color) {
	moves = {src:src, branches:[]};
	var tx = src.x;
	var ty = src.y;
	if (tx+1 < 8) {
		if (isNotFriendly(brd[tx+1][ty],color)) {
			moves.branches[moves.branches.length] = {x:tx+1,y:ty};
		}
	}
	if (tx-1 > -1) {
		if (isNotFriendly(brd[tx-1][ty],color)) {
			moves.branches[moves.branches.length] = {x:tx-1,y:ty};
		}
	}
	if (ty+1 < 8) {
		if (isNotFriendly(brd[tx][ty+1],color)) {
			moves.branches[moves.branches.length] = {x:tx,y:ty+1};
		}
	}
	if (ty-1 > -1) {
		if (isNotFriendly(brd[tx][ty-1],color)) {
			moves.branches[moves.branches.length] = {x:tx,y:ty-1};
		}
	}
	if (tx+1 < 8 && ty+1 < 8) {
		if (isNotFriendly(brd[tx+1][ty+1],color)) {
			moves.branches[moves.branches.length] = {x:tx+1,y:ty+1};
		}
	}
	if (tx+1 < 8 && ty-1 > -1) {
		if (isNotFriendly(brd[tx+1][ty-1],color)) {
			moves.branches[moves.branches.length] = {x:tx+1,y:ty-1};
		}
	}
	if (tx+1 < 8 && ty+1 < 8) {
		if (isNotFriendly(brd[tx-1][ty+1],color)) {
			moves.branches[moves.branches.length] = {x:tx-1,y:ty+1};
		}
	}
	if (tx+1 < 8 && ty-1 > -1) {
		if (isNotFriendly(brd[tx-1][ty-1],color)) {
			moves.branches[moves.branches.length] = {x:tx-1,y:ty-1};
		}
	}
	// for (var i = 0; i < moves.branches.length; i++) {
	// 	if (moves.branches[i].x > 7 || moves.branches[i].x < 0 || moves.branches[i].y > 7 || moves.branches[i].y < 0) {
	// 		var array = [];
	// 		for (var j = 0; j < moves.branches.length-1; j++) {
	// 			if (j != i) {
	// 				array[array.length] = moves.branches[j];
	// 			}
	// 		}
	// 		moves.branches = array;
	// 	}
	// }
	// console.log("moves generated");
	// for (var i = 0; i < moves.branches.length; i++) {
	// 	console.log("	" + i + "th move " + moves.branches[i].x + "," + moves.branches[i].y);
	// }
	return moves;
}

function getQueenMoves(brd, src, color) {
	moves = {src:src, branches:[]};
	// console.log("entered getQueenMoves");
	if (color == "WHITE") {
		var tx = src.x+1;
		var ty = src.y;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
		}
		tx = src.x-1;
		ty = src.y;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
		}
		tx = src.x;
		ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			ty += 1;
		}
		tx = src.x;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			ty -= 1;
		}
		tx = src.x+1;
		ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
			ty += 1;
		}
		tx = src.x+1;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
			ty -= 1;
		}
		tx = src.x-1;
		ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
			ty += 1;
		}
		tx = src.x-1;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
			ty -= 1;
		}
	} else /*black*/ {
		var tx = src.x+1;
		var ty = src.y;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
		}
		tx = src.x-1;
		ty = src.y;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
		}
		tx = src.x;
		ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			ty += 1;
		}
		tx = src.x;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			ty -= 1;
		}
		tx = src.x+1;
		ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
			ty += 1;
		}
		tx = src.x+1;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
			ty -= 1;
		}
		tx = src.x-1;
		ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
			ty += 1;
		}
		tx = src.x-1;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
			ty -= 1;
		}
	}
	return moves;
}

function getBishopMoves(brd, src, color) {
	moves = {src:src, branches:[]};
	if (color == "WHITE") {
		var tx = src.x+1;
		var ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
			ty += 1;
		}
		tx = src.x+1;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
			ty -= 1;
		}
		tx = src.x-1;
		ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
			ty += 1;
		}
		tx = src.x-1;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
			ty -= 1;
		}
	} else /*black*/ {
		var tx = src.x+1;
		var ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
			ty += 1;
		}
		tx = src.x+1;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
			ty -= 1;
		}
		tx = src.x-1;
		ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
			ty += 1;
		}
		tx = src.x-1;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
			ty -= 1;
		}
	}
	return moves;
}

function getKnightMoves(brd, src, color) {
	moves = {src:src, branches:[]};
	var tx = src.x;
	var ty = src.y;
	if (tx+1 < 8 && ty+2 < 8) {
		if (isNotFriendly(brd[tx+1][ty+2],color)) {
			moves.branches[moves.branches.length] = {x:tx+1,y:ty+2};
		}
	}
	if (tx+1 < 8 && ty-2 > -1) {
		if (isNotFriendly(brd[tx+1][ty-2],color)) {
			moves.branches[moves.branches.length] = {x:tx+1,y:ty-2};
		}
	}
	if (tx-1 > -1 && ty+2 < 8) {
		if (isNotFriendly(brd[tx-1][ty+2],color)) {
			moves.branches[moves.branches.length] = {x:tx-1,y:ty+2};
		}
	}
	if (tx-1 > -1 && ty-2 > -1) {
		if (isNotFriendly(brd[tx-1][ty-2],color)) {
			moves.branches[moves.branches.length] = {x:tx-1,y:ty-2};
		}
	}
	if (tx+2 < 8 && ty+1 < 8) {
		if (isNotFriendly(brd[tx+2][ty+1],color)) {
			moves.branches[moves.branches.length] = {x:tx+2,y:ty+1};
		}
	}
	if (tx+2 < 8 && ty-1 > -1) {
		if (isNotFriendly(brd[tx+2][ty-1],color)) {
			moves.branches[moves.branches.length] = {x:tx+2,y:ty-1};
		}
	}
	if (tx-2 > -1 && ty+1 < 8) {
		if (isNotFriendly(brd[tx-2][ty+1],color)) {
			moves.branches[moves.branches.length] = {x:tx-2,y:ty+1};
		}
	}
	if (tx-2 > -1 && ty-1 > -1) {
		if (isNotFriendly(brd[tx-2][ty-1],color)) {
			moves.branches[moves.branches.length] = {x:tx-2,y:ty-1};
		}
	}
	return moves;
}

function getRookMoves(brd, src, color) {
	// console.log("entered rookmoves");
	moves = {src:src, branches:[]};
	if (color == "WHITE") {
		var tx = src.x+1;
		var ty = src.y;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
		}
		tx = src.x-1;
		ty = src.y;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
		}
		tx = src.x;
		ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			ty += 1;
		}
		tx = src.x;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"WHITE")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			ty -= 1;
		}
	} else /*black*/ {
		var tx = src.x+1;
		var ty = src.y;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx += 1;
		}
		tx = src.x-1;
		ty = src.y;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			tx -= 1;
		}
		tx = src.x;
		ty = src.y+1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			ty += 1;
		}
		tx = src.x;
		ty = src.y-1;
		while (tx < 8 && tx > -1 && ty < 8 && ty > -1) {
			if (brd[tx][ty] == NULL_PIECE) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
			} else if (isEnemy(brd[tx][ty],"BLACK")) {
				moves.branches[moves.branches.length] = {x:tx,y:ty};
				break;
			} else {
				break;
			}
			ty -= 1;
		}
	}
	return moves;
}

function getPawnMoves(brd, src, color) {
	moves = {src:src, branches:[]};
	// console.log("entered pawn moves");
	if (color == "WHITE") {
		if (src.x < 8 && src.x > -1 && src.y < 7 && src.y > 0) {
			if (!sq_is_occupied(brd, src.x,src.y-1)) {
				moves.branches[moves.branches.length] = {x:src.x,y:src.y-1};
			}
		}
		if (src.y == 6) {
			if (!sq_is_occupied(brd, src.x,src.y-2)  && !sq_is_occupied(brd, src.x,src.y-1)) {
				moves.branches[moves.branches.length] = {x:src.x,y:src.y-2};
			}
		}
		if (src.x < 7 && src.y > 0) {
			if (isEnemy(brd[src.x+1][src.y-1],color)) {
				moves.branches[moves.branches.length] = {x:src.x+1,y:src.y-1};
			}
		}
		if (src.x > 0 && src.y > 0) {
			if (isEnemy(brd[src.x-1][src.y-1],color)) {
				moves.branches[moves.branches.length] = {x:src.x-1,y:src.y-1};
			}
		}
	} else /*black*/ {
		if (src.x < 8 && src.x > -1 && src.y < 7 && src.y > 0) {
			if (!sq_is_occupied(brd, src.x,src.y+1)) {
				moves.branches[moves.branches.length] = {x:src.x,y:src.y+1};
			}
		}
		if (src.y == 1) {
			if (!sq_is_occupied(brd, src.x,src.y+2) && !sq_is_occupied(brd, src.x,src.y+1)) {
				moves.branches[moves.branches.length] = {x:src.x,y:src.y+2};
			}
		}
		if (src.x < 7 && src.y > 0) {
			if (isEnemy(brd[src.x+1][src.y+1],color)) {
				moves.branches[moves.branches.length] = {x:src.x+1,y:src.y+1};
			}
		}
		if (src.x > 0 && src.y > 0) {
			if (isEnemy(brd[src.x-1][src.y+1],color)) {
				moves.branches[moves.branches.length] = {x:src.x-1,y:src.y+1};
			}
		}
	}
	/*console.log("moves generated");
	for (var i = 0; i < moves.branches.length; i++) {
		console.log("	" + i + "th move " + moves.branches[i].x + "," + moves.branches[i].y);
	}*/
	return moves;
}

function sq_is_occupied(brd, x,y) {
	if (brd[x][y] == NULL_PIECE) {
		return false;
	}
	// console.log("square is occupied");
	return true;
}

function isNotFriendly(piece,color) {
	if (((piece == BLACK_PIECES.king || piece == BLACK_PIECES.queen || piece == BLACK_PIECES.bishop || piece == BLACK_PIECES.knight || piece == BLACK_PIECES.rook || piece == BLACK_PIECES.pawn) && color == "BLACK") || ((piece == WHITE_PIECES.king || piece == WHITE_PIECES.queen || piece == WHITE_PIECES.bishop || piece == WHITE_PIECES.knight || piece == WHITE_PIECES.rook || piece == WHITE_PIECES.pawn) && color == "WHITE")) {
		// console.log("non enemy dest_piece");
		return false;
	}
	return true;
}

function isEnemy(piece,color) {
	if (piece != NULL_PIECE) {
		if (((piece == BLACK_PIECES.king) || (piece == BLACK_PIECES.queen) || (piece == BLACK_PIECES.bishop) || (piece == BLACK_PIECES.knight) || (piece == BLACK_PIECES.rook) || (piece == BLACK_PIECES.pawn)) && color == "WHITE") {
			return true;
		} else if (((piece == WHITE_PIECES.king) || (piece == WHITE_PIECES.queen) || (piece == WHITE_PIECES.bishop) || (piece == WHITE_PIECES.knight) || (piece == WHITE_PIECES.rook) || (piece == WHITE_PIECES.pawn)) && color == "BLACK") {
			return true;
		} else { return false; }
	}
	return false;
}

function convert_to_square(sq) {
	square = "";
	square += String.fromCharCode(97+sq.x);
	square += (7-sq.y)+1;
	return square;
}

function capitalize(piece) {
	if (piece == BLACK_PIECES.king) {
		return WHITE_PIECES.king;
	} else if (piece == BLACK_PIECES.queen) {
		return WHITE_PIECES.queen;
	} else if (piece == BLACK_PIECES.bishop) {
		return WHITE_PIECES.bishop;
	} else if (piece == BLACK_PIECES.knight) {
		return WHITE_PIECES.knight;
	} else if (piece == BLACK_PIECES.rook) {
		return WHITE_PIECES.rook;
	} else if (piece == BLACK_PIECES.pawn) {
		return "";
	} else if (piece == WHITE_PIECES.pawn) {
		return "";
	}
	return piece;
}