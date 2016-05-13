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