<!--
login.php
-->

<?php
	include 'header.php';
?>

<div id="container">
	
	<div id="content">

		<h1>Login</h1>

		<!-- php script redirects to index.php if the user is already logged in -->
		<?php
			if (isset($_SESSION['id'])) {
				echo "You are already logged in!";
				header("Location: ./");
			}
		?>

		<!-- getting the url from the server to handle thrown errors -->
		<?php
			$url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
			// if the $url contains login_failure error
			if (strpos($url,'error=login_failure') !== false) {
				echo "<br><h3 class='red_error_text'>Your username or password were incorrect.</h3>";
			}
		?>
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
