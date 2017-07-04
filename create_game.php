<!--
create_game.php
-->

<h2><center>create a game</center></h2>
<br>

<!-- game creation form -->
<form id="create_game_form" action="includes/create_game.inc.php" method="POST" enctype="multipart/formdata">
	<br><img style="margin-left:90px;" src="assets/pieces/w_King.png"><img src="assets/random_color_icon.png"><img src="assets/pieces/b_King.png"><br>
	<input style="margin-left:125px;" class="color_selector" type="radio" name="radio" value="white">
	<input class="color_selector" type="radio" name="radio" value="random" checked>
	<input class="color_selector" type="radio" name="radio" value="black" ><br><br><br><h2 style="margin-left:100px;float: left;">white</h2><h2 style="float: left;">random</h2><h2 style="float: left;">black</h2><br><br>
	<select name="vs" style="margin-left:160px;margin-top: 20px;font-size: 24px; background-color: #1d1e21;border: none;color: grey;">
		<option value="computer">vs computer</option>
		<option value="player">vs player</option>
	</select>
	<br><br><hr style="color:white;width:80%;margin-right: auto;margin-left: auto;"><br><input style="margin-left: 160px;font-size: 26px;color:white;background-color: #1d1e21;border:none;" id="create_game_button" type="submit" name="create_game_button" value="create game">
</form>