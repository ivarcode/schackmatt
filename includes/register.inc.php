<?php

session_start();
include '../dbh.php';

// initialize and prevent SQL injection
$email = mysqli_real_escape_string($conn,$_POST['email']);
$username = mysqli_real_escape_string($conn,$_POST['username']);
$name = mysqli_real_escape_string($conn,$_POST['name']);
$password = mysqli_real_escape_string($conn,$_POST['password']);
$confirm_password = mysqli_real_escape_string($conn,$_POST['confirm_password']);

// getting the currently existing user with the same username (if one exists)
$stmt = $conn->prepare("SELECT username FROM user WHERE username=?");
// binding $usr var param
$stmt->bind_param("s",$usr);
$usr = $username;
// executing once for the username
$stmt->execute();

// setting the result of the stmt execution
$result = $stmt->get_result();

// checking to see if username is taken
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
		$stmt = $conn->prepare("INSERT INTO user (email, username, name, password) VALUES (?,?,?,?)");
		// binding $e,$usr,$n,$pwd var params
		$stmt->bind_param("ssss",$e,$usr,$n,$pwd);
		$e = $email;
		$usr = $username;
		$n = $name;
		$pwd = $hash; // hashing pwd
		// executing
		$stmt->execute();

		// setting result
		$result = $stmt->get_result();

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