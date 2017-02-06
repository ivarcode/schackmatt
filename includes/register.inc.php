<?php

session_start();
include '../dbh.php';

$email = $_POST['email'];
$username = $_POST['username'];
$name = $_POST['name'];
$password = $_POST['password'];
$confirm_password = $_POST['confirm_password'];

// checking to see if username is taken
$sql = "SELECT username FROM user WHERE username='$username'";
$result = mysqli_query($conn,$sql);
if (mysqli_num_rows($result) > 0) {
	// refresh page and throw username_is_taken error
	header("Location: ../register.php?error=username_is_taken");
	exit();
} else {
	// checking to see if password & confirm_password are equal
	if ($password == $confirm_password) {
		// hashing password
		$hash = password_hash($password,PASSWORD_DEFAULT);
		// register user and return to index.php
		$sql = "INSERT INTO user (email, username, name, password) VALUES ('$email','$username','$name','$hash')";
		$result = mysqli_query($conn,$sql);

		// redirect to login.php with the registration success message
		header("Location: ../login.php?info=registration_success");
		exit();
	} else {
		// refresh page and throw passwords_do_not_match error
		header("Location: ../register.php?error=passwords_do_not_match");
		exit();
	}
}

?>