/*
game.js
*/

function game(p1, p2, board, turn, record, move_count) {
	this.p1 = p1;
	this.p2 = p2;
	this.board = BOARD_TEST;
	this.turn = turn;
	this.record = record;
	this.move_count = move_count;
	this.enPassant_allowedAt = null;
}

function move(src, dest, notation) {
	this.src = src;
	this.dest = dest;
	this.notation = notation;
}

function piece(type, color) {
	this.type = type;
	this.color = color;
}

var nullpiece = null;
var wPawn = new piece("PAWN", "WHITE");
var wKnight = new piece("KNIGHT", "WHITE");
var wBishop = new piece("BISHOP", "WHITE");
var wRook = new piece("ROOK", "WHITE");
var wQueen = new piece("QUEEN", "WHITE");
var wKing = new piece("KING", "WHITE");
var bPawn = new piece("PAWN", "BLACK");
var bKnight = new piece("KNIGHT", "BLACK");
var bBishop = new piece("BISHOP", "BLACK");
var bRook = new piece("ROOK", "BLACK");
var bQueen = new piece("QUEEN", "BLACK");
var bKing = new piece("KING", "BLACK");


var BOARD_STANDARD = [
[wRook,wKnight,wBishop,wQueen,wKing,wBishop,wKnight,wRook],
[wPawn,wPawn,wPawn,wPawn,wPawn,wPawn,wPawn,wPawn],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[bPawn,bPawn,bPawn,bPawn,bPawn,bPawn,bPawn,bPawn],
[bRook,bKnight,bBishop,bQueen,bKing,bBishop,bKnight,bRook]
];

var BOARD_TEST = [
[wKing,wQueen,wBishop,wKnight,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,wPawn,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,bPawn],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,wPawn,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,bPawn,nullpiece],
[bKing,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece]
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


function makeMove(src,dest,game) {
	// console.log(game);
	console.log("moving piece " + game.board[src.x][src.y].color + " " + game.board[src.x][src.y].type);
	if (isLegalMove(src,dest,game)) {
		updatePGN(src,dest,game);
		movePiece(src,dest,game);
		game.move_count++;
		printGame(game);
		// if (game.turn == "WHITE") {
		// 	game.turn = "BLACK";
		// } else {
		// 	game.turn = "WHITE";
		// }
		// console.log(game.turn + " turn");
	} else {
		console.log("move is not valid");
	}
}

function movePiece(src,dest,game) {
	// console.log("movePiece(src = " + src.x + "," + src.y + " dest = " + dest.x + "," + dest.y + ")");
	if (game.enPassant_allowedAt != null && dest.x == game.enPassant_allowedAt.x && dest.y == game.enPassant_allowedAt.y && game.board[src.x][src.y].type == "PAWN") {
		// console.log(dest.x);
		if (dest.x == 5) {
			// console.log("capping piece " + 4 + "," + dest.y);
			game.board[4][dest.y] = nullpiece;
			// console.log("on rank 5");
		} else if (dest.x == 2) {
			game.board[3][dest.y] = nullpiece;
			// console.log("on rank 2");
		} else {
			// console.log("not taking on ranks 5 or 2");
		}
		if (game.turn == "WHITE") {
			game.board[dest.x][dest.y] = wPawn;
		} else {
			game.board[dest.x][dest.y] = bPawn;
		}
		game.board[src.x][src.y] = nullpiece;
		game.enPassant_allowedAt = null;
	} else {
		// console.log(" - movePiece(src = " + src.x + "," + src.y + " dest = " + dest.x + "," + dest.y + ")");
		// console.log(game.board[src.x][src.y]);
		// console.log(game.board[dest.x][dest.y]);
		// printGame(game);
		game.enPassant_allowedAt = null;
		if (game.board[src.x][src.y].type == "PAWN" && Math.abs(dest.x-src.x) == 2) {
			// console.log(":: " + src.x + "," + src.y + " --> " + dest.x + "," + dest.y);
			game.enPassant_allowedAt = {x:(src.x+dest.x)/2,y:src.y};
		}
		// console.log("game before move");
		// printGame(game);
		game.board[dest.x][dest.y] = game.board[src.x][src.y];
		game.board[src.x][src.y] = nullpiece;
		// printGame(game);
	}
	if (game.turn == "WHITE") {
		game.turn = "BLACK";
	} else {
		game.turn = "WHITE";
	}
	// printGame(game);
}

function updatePGN(src,dest,game) {
	// console.log(game.record.length);
	var notation = getNotation(src,dest,game);
	game.record[game.record.length] = new move(src,dest,notation);
	//printPGN(game);
}

function printPGN(game) {
	var pgn = "";
	for (var i = 0; i < game.record.length; i++) {
		pgn += game.record[i].notation + " ";
	}
	console.log("\tPGN :: " + pgn);
}

function printGame(game) {
	console.log("printGame()");
	console.log("\t" + game.p1 + " vs " + game.p2);
	console.log("\t" + game.turn + " turn");
	console.log("\t" + game.move_count + " moves");
	printPGN(game);
	if (game.enPassant_allowedAt != null) {
		console.log("enPassant_allowedAt " + game.enPassant_allowedAt.x + "," + game.enPassant_allowedAt.y);
	} 
	/*var printedBoard = "";
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			printedBoard += "[";
			try {
				var piecetype = game.board[7-i][j].type;
				if (piecetype == "KING") {
					printedBoard += "K";
				} else if (piecetype == "QUEEN") {
					printedBoard += "Q";
				} else if (piecetype == "BISHOP") {
					printedBoard += "B";
				} else if (piecetype == "KNIGHT") {
					printedBoard += "N";
				} else if (piecetype == "ROOK") {
					printedBoard += "R";
				} else if (piecetype == "PAWN") {
					printedBoard += "P";
				}
			} catch(e) {
				// console.log("ERR :: " + e.message);
				if (game.enPassant_allowedAt != null && game.enPassant_allowedAt.x == 7-i && game.enPassant_allowedAt.y == j) {
					printedBoard += "E";//en passant sq key
				} else {
					printedBoard += " ";//no piece
				}
			}			
			printedBoard += "]";
		}
		printedBoard += "\n";
	}
	console.log(printedBoard);*/
}