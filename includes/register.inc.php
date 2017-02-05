<?php

session_start();
include '../dbh.php';

$email = $_POST['email'];
$username = $_POST['username'];
$name = $_POST['name'];
$password = $_POST['password'];
$confirm_password = $_POST['confirm_password'];

// checking to see if password & confirm_password are equal
if ($password == $confirm_password) {
	// register user and return to index.php
	$sql = "INSERT INTO user (email, username, name, password) VALUES ('$email','$username','$name','$password')";
	$result = mysqli_query($conn,$sql);

	// redirect to index.php
	header("Location: ../");
} else {
	// refresh page and throw error
	header("Location: ../register.php?error=passwords_do_not_match");
}



?>