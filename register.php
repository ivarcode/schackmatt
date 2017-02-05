<!--
register.php
-->

<?php
	include 'header.php';
?>

<div id="container">
	
	<div id="content">

		<h1>Register</h1>
		
		<!-- php script redirects to index.php if the user is already logged in -->
		<?php
			if (isset($_SESSION['id'])) {
				echo "You are already logged in!";
				header("Location: index.php");
			}
		?>
		
		<!-- getting the url from the server to handle thrown errors -->
		<?php
			$url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
			// if the $url contains username_is_taken error
			if (strpos($url,'error=username_is_taken') !== false) {
				echo "<br><h3 class='red_error_text'>That username is taken.</h3>";
			}
			// if the $url contains passwords_do_not_match error
			elseif (strpos($url,'error=passwords_do_not_match') !== false) {
				echo "<br><h3 class='red_error_text'>Your passwords did not match.</h3>";
			}
		?>
		<br>
		<!-- register form -->
		<form action="includes/register.inc.php" method="POST" enctype="multipart/formdata">
			<input id="email" type="email" name="email" placeholder="email address" required="required" autofocus><br>
			<input id="username" type="text" name="username" placeholder="username" required="required"><br>
			<input id="name" type="text" name="name" placeholder="name (optional)"><br>
			<input id="password" type="password" name="password" placeholder="password" required="required"><br>
			<input id="confirm_password" type="password" name="confirm_password" placeholder="confirm password" required="required"><br>
			<input id="register_button" type="submit" name="register" value="register">
		</form>

	</div>

</div>

<?php
	include 'footer.php';
?>
