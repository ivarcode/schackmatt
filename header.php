<!--
header.php
-->

<?php
	session_start();
	include 'dbh.php';
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
			<!-- site logo -->
			<a href="./"><img src="assets/logo.png?<?php echo time(); ?>" height="40px"></a>
		</ul>
		<ul id="unordered_list_right">
			<?php
				if (isset($_SESSION['id'])) {
					// if the user is logged in, show their username (button to their profile) and the logout button
					echo "<li><a href='#'>USERNAME_GOES_HERE</a></li>";
					echo "<li><a href='includes/logout.inc.php'>Logout</a></li>";
				} else {
					// if the user is not logged in, show login button and the register button
					echo "<li><a href='login.php'>Login</a></li>";
					echo "<li><a href='register.php'>Register</a></li>";
				}
			?>
			
		</ul>
	</nav>
</header>