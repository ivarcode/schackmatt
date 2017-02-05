<?php

session_start();
include '../dbh.php';

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM user WHERE username='$username' AND password='$password'";
$result = mysqli_query($conn,$sql);

if (!$row = mysqli_fetch_assoc($result)) {
	// refresh page and throw login_failure error
	header("Location: ../login.php?error=login_failure");
} else {
	// logs the user in
	$_SESSION['id'] = $row['id'];
	header("Location: ../");
}

?>