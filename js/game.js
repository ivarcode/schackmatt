/*
game.js
*/

function game(p1, p2, board, record) {
	this.p1 = p1;
	this.p2 = p2;
	this.board = BOARD_STANDARD;
	this.turn = "WHITE";
	this.record = record;
	this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	this.castling = [];
	for (var i = 0; i < 4; i++) {
		this.castling[i] = true;
	}
	this.halfmove = 0;
	this.move_count = 1;
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
[wKing,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,wPawn,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
[nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece,nullpiece],
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
	try {
		// console.log("moving piece " + game.board[src.x][src.y].color + " " + game.board[src.x][src.y].type);
	} catch(e) {
		// console.log("ERR :: " + e.message);
	}
	if (isLegalMove(src,dest,game)) {
		updatePGN(src,dest,game);
		movePiece(src,dest,game);
		if (game.turn == "WHITE") {
			game.move_count++;
		}
		updateFEN(game);
		printGame(game);
	} else {
		// console.log("move is not valid");
	}
}

function movePiece(src,dest,game) {
	if (game.enPassant_allowedAt != null && dest.x == game.enPassant_allowedAt.x && dest.y == game.enPassant_allowedAt.y && game.board[src.x][src.y].type == "PAWN") {
		if (dest.x == 5) {
			game.board[4][dest.y] = nullpiece;
		} else if (dest.x == 2) {
			game.board[3][dest.y] = nullpiece;
		}
		if (game.turn == "WHITE") {
			game.board[dest.x][dest.y] = wPawn;
		} else {
			game.board[dest.x][dest.y] = bPawn;
		}
		game.board[src.x][src.y] = nullpiece;
		game.enPassant_allowedAt = null;
	} else {
		game.enPassant_allowedAt = null;
		if (game.board[src.x][src.y].type == "PAWN" && Math.abs(dest.x-src.x) == 2) {
			game.enPassant_allowedAt = {x:(src.x+dest.x)/2,y:src.y};
		}
		game.board[dest.x][dest.y] = game.board[src.x][src.y];
		game.board[src.x][src.y] = nullpiece;
	}
	if (game.board[src.x][src.y].type == "KING") {
		
	}
	switchTurn(game);
}

function switchTurn(game) {
	if (game.turn == "WHITE") {
		game.turn = "BLACK";
	} else {
		game.turn = "WHITE";
	}
}

function updatePGN(src,dest,game) {
	var notation = getNotation(src,dest,game);
	game.record[game.record.length] = new move(src,dest,notation);
}

function updateFEN(game) {
	var newFEN = "";
	var inc = 0;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (game.board[7-i][j] == null) {
				inc++;
			} else {
				if (inc > 0) {
					newFEN += inc;
					inc = 0;
				}
				if (game.board[7-i][j].color == "WHITE") {
					if (game.board[7-i][j].type == "KING") {
						newFEN += "K";
					} else if (game.board[7-i][j].type == "QUEEN") {
						newFEN += "Q";
					} else if (game.board[7-i][j].type == "BISHOP") {
						newFEN += "B";
					} else if (game.board[7-i][j].type == "KNIGHT") {
						newFEN += "N";
					} else if (game.board[7-i][j].type == "ROOK") {
						newFEN += "R";
					} else if (game.board[7-i][j].type == "PAWN") {
						newFEN += "P";
					}
				} else {
					if (game.board[7-i][j].type == "KING") {
						newFEN += "k";
					} else if (game.board[7-i][j].type == "QUEEN") {
						newFEN += "q";
					} else if (game.board[7-i][j].type == "BISHOP") {
						newFEN += "b";
					} else if (game.board[7-i][j].type == "KNIGHT") {
						newFEN += "n";
					} else if (game.board[7-i][j].type == "ROOK") {
						newFEN += "r";
					} else if (game.board[7-i][j].type == "PAWN") {
						newFEN += "p";
					}
				}
			}
		}
		if (inc > 0) {
			newFEN += inc;
			inc = 0;
		}
		if (i != 7) {
			newFEN += "/";
		}
	}
	newFEN += " ";
	if (game.turn == "WHITE") {
		newFEN += "w";
	} else {
		newFEN += "b";
	}
	newFEN += " ";
	if (game.castling[0]) {
		newFEN += "K";
	}
	if (game.castling[1]) {
		newFEN += "Q";
	}
	if (game.castling[2]) {
		newFEN += "k";
	}
	if (game.castling[3]) {
		newFEN += "q";
	} else {
		if (game.castling[0] && game.castling[1] && game.castling[2] && game.castling[3]) {
			newFEN += "-";
		}
	}
	newFEN += " ";
	if (game.enPassant_allowedAt != null) {
		newFEN += pairToSq(game.enPassant_allowedAt);
	} else {
		newFEN += "-";
	}
	newFEN += " ";
	newFEN += game.halfmove;
	newFEN += " ";
	newFEN += game.move_count;

	game.fen = newFEN;
	document.getElementById('FEN').innerHTML = game.fen;
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
	console.log("\t" + getLegalMoves(game).length + " moves");
	if (inCheck(game)) {
		console.log("\t" + game.turn + " KING in check");
	} else {
		console.log("\t" + game.turn + " KING is safe");
	}
	printPGN(game);
	if (game.enPassant_allowedAt != null) {
		console.log("\tenPassant_allowedAt " + game.enPassant_allowedAt.x + "," + game.enPassant_allowedAt.y);
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