<!-- game.js file - full script file for the game object and methods associated with manipulating the game -->
<script type="text/javascript" src="../js/game.js?<?php echo time(); ?>"></script>
<!-- local script on analysis_board.php that displays the game with a user interface -->
<script type="text/javascript">
// initializing a standard game
// var game = new Game("player_one","player_two","STANDARD","rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",[]);
var game = new Game("player_one","player_two","STANDARD","8/2k5/8/6N1/8/2B3B1/3K4/8 w - - 0 1",[]);

print_game_info(game);

</script>

<div id="game">
	
	<canvas id="board" width="640" height="640">canvas</canvas>

	<div id="game_data">
		<h3 id="materialBalance">null</h3>
	</div>

	<div>
		<h4 id="FEN">fen placeholder</h4>
	</div>

</div>