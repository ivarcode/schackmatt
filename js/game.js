/*
game.js
*/

function game(p1, p2, board) {
	this.p1 = p1;
	this.p2 = p2;
	this.board = BOARD_STANDARD;
	this.turn = "WHITE";
	this.record = [];
}

function printGame(game) {
	console.log(game.p1 + " vs " + game.p2);
	console.log(game.turn + " turn");
	var printedBoard = "";
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			printedBoard += " ";
			try {
				printedBoard += game.board[7-i][j].type;
			} catch(e) {
				// console.log("ERR :: " + e.message);
			}			
			printedBoard += " ";
		}
		printedBoard += "\n";
	}
	console.log(printedBoard);
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


function makeMove(src, dest, game) {
	if (isLegalMove(game,src,dest)) {
		game.board[dest.x][dest.y] = game.board[src.x][src.y];
		game.board[src.x][src.y] = nullpiece;
		if (game.turn == "WHITE") {
			game.turn = "BLACK";
		} else {
			game.turn = "WHITE";
		}
		console.log(game.turn + " turn");
		updatePGN(src,dest,game);
	} else {
		console.log("move is not valid");
	}
}

function updatePGN(src, dest, game) {
	// console.log(game.record.length);
	var notation = getNotation(src,dest,game);
	game.record[game.record.length] = new move(src,dest,notation);
	printPGN(game);
}

function printPGN(game) {
	var pgn = "";
	for (var i = 0; i < game.record.length; i++) {
		pgn += game.record[i].notation + " ";
	}
	console.log("PGN :: " + pgn);
}