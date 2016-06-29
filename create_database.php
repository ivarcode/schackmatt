<!DOCTYPE html>
<!-- Demonstrates how to create a database using PHP -->
<html>
<head>
	<title>Create MySQL Database</title>
</head>

<body style="text-align:center; margin:75px;">
	<?php
	$db_conn = mysqli_connect("localhost", "root", "");
	if (!$db_conn)
		die("Unable to connect: " . mysqli_connect_error());

	if (mysqli_query($db_conn, "CREATE DATABASE login_db;"))
	echo "Database ready<br>";
	else
		echo "Unable to create database: " . mysqli_error($db_conn) . "<br>";

	mysqli_select_db($db_conn, "login_db");

	$cmd = "CREATE TABLE IF NOT EXISTS users (
	id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	username varchar(60) UNIQUE NOT NULL,
	password varchar(60) NOT NULL,
	profile_info1 varchar(60),
	profile_info2 varchar(60)
	);";

	if( mysqli_query($db_conn, $cmd) )
		echo "Table 'users' created<br>";
	else
		echo "Table not created: ". mysqli_error($db_conn) . "<br>";

	mysqli_close($db_conn);
	?>
</body>
</html>
