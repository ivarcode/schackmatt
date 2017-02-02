<!--
login.php
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


	</div>
	<div id="footer">
		
	</div>
</div>

</body>
</html>