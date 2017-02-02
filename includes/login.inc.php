<?php

session_start();
include '../dbh.php';

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM user WHERE username='$username' AND password='$password'";
$result = mysqli_query($conn,$sql);

if (!$row = mysqli_fetch_assoc($result)) {
	echo "Your username and/or password is incorrect.";
} else {
	// echo "You are logged in.";
	$_SESSION['id'] = $row['id'];
}

header("Location: ../index.php");

?>