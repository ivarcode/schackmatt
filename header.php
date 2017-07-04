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
			<a style="float: left;" href="./"><img src="assets/logo.png?<?php echo time(); ?>" height="40px"></a>
			<?php
				// if (isset($_SESSION['id'])) {
				// 	echo "<li style='margin-left:40px;'><a href='includes/logout.inc.php'>create a game</a></li>";
				// }
			?>
		</ul>
		<ul id="unordered_list_right">
			<?php
				if (isset($_SESSION['id'])) {
					// if the user is logged in, show their username (button to more options in the future) and the logout button
					$sesh_id = $_SESSION['id'];
					// getting the data from the server
					$sql = "SELECT * FROM user WHERE id='$sesh_id'";
					$result = mysqli_query($conn,$sql);
					$row = mysqli_fetch_assoc($result);
					// displaying the username and logout button in the header
					echo "<li><a href='#'>".$row['username']."</a></li>";
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