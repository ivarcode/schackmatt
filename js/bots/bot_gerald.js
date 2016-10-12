/*
bot_gerald.js
*/

function calculate_tree(game) {
	/*function will calculate a tree of moves out of position of the input game*/
	console.log(game.get_FEN());
	var moves = game.get_legal_moves();
	console.log(moves);
}