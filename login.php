<!--
login.php
-->

<?php
	include 'header.php';
?>

<div id="container">
	
	<div id="content">

		<!-- php script redirects to index.php if the user is already logged in -->
		<?php
			if (isset($_SESSION['id'])) {
				echo "You are already logged in!";
				header("Location: index.php");
			}
		?>

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
