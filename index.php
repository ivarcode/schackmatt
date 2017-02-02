<!--
index.php
-->

<?php
	include 'header.php';
?>

<div id="container">
	
	<div id="content">
		<!-- login form -->
		<form action="includes/login.inc.php" method="POST" enctype="multipart/formdata">
			<input type="text" name="username" placeholder="username" required="required" autofocus><br>
			<input type="password" name="password" placeholder="password" required="required"><br>
			<input type="submit" name="login" value="login">
		</form>

		<?php
			if (isset($_SESSION['id'])) {
				echo $_SESSION['id'];
			} else {
				echo "You are not logged in.";
			}
		?>

		<br><br>

		<!-- register form -->
		<form action="includes/register.inc.php" method="POST" enctype="multipart/formdata">
			<input type="email" name="email" placeholder="email address" required="required" autofocus><br>
			<input type="text" name="username" placeholder="username" required="required"><br>
			<input type="text" name="name" placeholder="name" required="required"><br>
			<input type="password" name="password" placeholder="password" required="required"><br>
			<input type="password" name="confirm_password" placeholder="confirm password" required="required"><br>
			<input type="submit" name="register" value="register">
		</form>

		<!-- logout form -->
		<form action="includes/logout.inc.php">
			<button>LOGOUT</button>
		</form>

	</div>
	<div id="footer">
		
	</div>
</div>

</body>
</html>