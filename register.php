<?php

include 'dbh.php';

$email = $_POST['email'];
$username = $_POST['username'];
$name = $_POST['name'];
$password = $_POST['password'];
$confirm_password = $_POST['confirm_password'];

$sql = "INSERT INTO user (email, username, name, password) VALUES ('$email','$username','$name','$password')";

$result = $mysqli_query($conn,$sql);

?>