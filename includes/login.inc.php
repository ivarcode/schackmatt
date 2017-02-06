<?php

session_start();
include '../dbh.php';

$username = $_POST['username'];
$password = $_POST['password'];

// getting the hash from the password column of the user
$sql = "SELECT * FROM user WHERE username='$username'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
$hash = $row['password'];

// if the password is NOT verified
if (!password_verify($password,$hash)) {
	// refresh page and throw login_failure error
	header("Location: ../login.php?error=login_failure");
	exit();
} else {
	$sql = "SELECT * FROM user WHERE username='$username' AND password='$hash'";
	$result = mysqli_query($conn,$sql);

	if (!$row = mysqli_fetch_assoc($result)) {
		// refresh page and throw login_failure error
		header("Location: ../login.php?error=login_failure");
		exit();
	} else {
		// logs the user in
		$_SESSION['id'] = $row['id'];
	}
	// redirects the user to index.php
	header("Location: ../");
}

?>