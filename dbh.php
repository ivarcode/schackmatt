<?php

// connects to the chess database
$conn = mysqli_connect("localhost","root","","chess");

if (!$conn) {
	// REMOVE mysqli_connect_error() when site made live to avoid SQL injection
	die("Connection failed ".mysqli_connect_error());
}

?>