/*
game.js
*/

function game(p1, p2, board) {
	this.p1 = p1;
	this.p2 = p2;
	this.board = [];
	for (var i = 0; i < 8; i++) {
		board[i] = [];
		for (var j = 0; j < 8; j++) {
			board[i][j] = BOARD_STANDARD[i][j];
		}
	}
}