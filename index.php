<!--
index.php
-->

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>schackmatt.net</title>
	<link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
<div id="container">
	<!-- <div id="navbar">
		<nav id="left_nav">
			<ul>
				<li><a href="#">Play</a></li>
				<li><a href="#">Tactics</a></li>
			</ul>
		</nav>
		<nav id="right_nav">
			<ul>
				<li><a href="#">Login</a></li>
				<li><a href="#">Register</a></li>
			</ul>
		</nav>
	</div>
	<div id="header">
		
	</div> -->
	<div id="content">
		<!-- register form -->
		<form action="register.php" method="POST" enctype="multipart/formdata">
			<input type="email" name="email" placeholder="email address" required="required" autofocus>
			<input type="text" name="username" placeholder="username" required="required">
			<input type="text" name="name" placeholder="name" required="required">
			<input type="password" name="password" placeholder="password" required="required">
			<input type="password" name="confirm_password" placeholder="confirm password" required="required">
			<input type="submit" name="register" value="register">
		</form>
	</div>
	<div id="footer">
		
	</div>
</div>

</body>
</html>