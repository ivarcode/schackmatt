









Game.prototype.is_checkmate = function() {
	/*returns whether or not the position in game is currently checkmate*/
	if (this.get_legal_moves().length == 0 && this.is_check()) {
		console.log("CHECKMATE");
		return true;
	}
	return false;
};
Game.prototype.is_stalemate = function() {
	/*returns whether or not the position in game is currently stalemate*/
	if (this.get_legal_moves().length == 0 && !this.is_check()) {
		console.log("STALEMATE");
		return true;
	}
	return false;
};
Game.prototype.get_players = function() {
	/*returns an object {p1,p2} which returns the respective players in Game*/
	return {p1:this.p1,p2:this.p2};
};














