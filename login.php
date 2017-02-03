<!--
login.php
-->

<?php
	include 'header.php';
?>

<div id="container">
	
	<div id="content">

		<h1>Login</h1>
		<br>
		<!-- login form -->
		<form action="includes/login.inc.php" method="POST" enctype="multipart/formdata">
			<input id="username" type="text" name="username" placeholder="username" required="required" autofocus><br>
			<input id="password" type="password" name="password" placeholder="password" required="required"><br>
			<input id="login_button" type="submit" name="login" value="login">
		</form>

	</div>

</div>

<?php
	include 'footer.php';
?>
