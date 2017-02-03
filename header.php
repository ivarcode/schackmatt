<!--
header.php
-->

<?php
	session_start();
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>schackmatt.net</title>
	<link rel="stylesheet" type="text/css" href="style.css?<?php echo time(); ?>">
</head>
<body>

<header>
	<nav>
		<ul id="unordered_list_left">
			<a href="./"><img src="assets/logo.png"></a>
		</ul>
		<ul id="unordered_list_right">
			<?php
				if (isset($_SESSION['id'])) {
					// user is logged in, do not show login button
				} else {
					echo "<li><a href='login.php'>Login</a></li>";
				}

				if (isset($_SESSION['id'])) {
					// user is logged in, do not show regster button
				} else {
					echo "<li><a href='register.php'>Register</a></li>";
				}

				if (isset($_SESSION['id'])) {
					echo "<li><a href='includes/logout.inc.php'>Logout</a></li>";
				} else {
					// user is not logged in, do not show logout button
				}
			?>
			
		</ul>
	</nav>
</header>