/*
game.js
*/

function game(p1, p2, board) {
	this.p1 = p1;
	this.p2 = p2;
	this.board = BOARD_STANDARD;
	this.turn = "WHITE";
}

function move(src, dest) {
	this.src = src;
	this.dest = dest;
	this.notation = null; //TODO
}

function piece(type, color) {
	this.type = type;
	this.color = color;
}

var nullpiece = new piece(null,null);
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


