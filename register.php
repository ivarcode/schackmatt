<!--
register.php
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

		<h1>Register</h1>
		<br>
		<!-- register form -->
		<form action="includes/register.inc.php" method="POST" enctype="multipart/formdata">
			<input id="email" type="email" name="email" placeholder="email address" required="required" autofocus><br>
			<input id="username" type="text" name="username" placeholder="username" required="required"><br>
			<input id="name" type="text" name="name" placeholder="name" required="required"><br>
			<input id="password" type="password" name="password" placeholder="password" required="required"><br>
			<input id="confirm_password" type="password" name="confirm_password" placeholder="confirm password" required="required"><br>
			<input id="register_button" type="submit" name="register" value="register">
		</form>

	</div>

</div>

<?php
	include 'footer.php';
?>
