<?php

session_start();
include '../dbh.php';

// initialize and prevent SQL injection
$username = mysqli_real_escape_string($conn,$_POST['username']);
$password = mysqli_real_escape_string($conn,$_POST['password']);

// getting the hash from the password column of the user
$stmt = $conn->prepare("SELECT * FROM user WHERE username=?");
// binding $usr and $pwd var params
$stmt->bind_param("ss",$usr,$pwd);
$usr = $username;
$pwd = $password;
// executing once for the row
$stmt->execute();

// setting the result of the stmt execution
$result = $stmt->get_result();

$row = mysqli_fetch_assoc($result);
$hash = $row['password'];

// if the password is NOT verified
if (!password_verify($password,$hash)) {
	// refresh page and throw login_failure error
	header("Location: ../login.php?error=login_failure");
	exit();
} else {
	// logs the user in
	$_SESSION['id'] = $row['id'];
	// redirects the user to index.php
	header("Location: ../");
}

?>