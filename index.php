<!-- 
index.php
-->

<?php
	$db_conn = mysqli_connect("localhost", "root", "");
	mysqli_select_db($db_conn, "login_db");
	session_start();
	if(!isset($_SESSION['active'])){
		header("Location: login.php");  //  back to login page
	}
?>
<!DOCTYPE html>
<html>
<head>
	<title>LOGIN PAGE TEMPLATE</title>
</head>

<body style="text-align:center; margin:75px;">
		<h1>THE COM214 WEB PAGE 1</h1>
		<h3> All the content behind authentication goes here </h3>
		<img src="newcycle3.png" width="300">
		<h3> <a href="index2.php">GOTO page 2</a></h3>
	  <?php
		if(isset($_SESSION['active']))
			echo "You are logged in as: " . $_SESSION['active'] . "<br>";
		?>
		<br><a href="logout.php">Logout</a>
</body>
</html>
