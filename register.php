<!--
register.php
-->

<?php
	include 'header.php';
?>

<div id="container">
	
	<div id="content">
		

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

		

	</div>

</div>

<?php
	include 'footer.php';
?>
