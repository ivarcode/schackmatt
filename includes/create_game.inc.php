<?php

session_start();
include '../dbh.php';

// initialize and prevent SQL injection
$radio = mysqli_real_escape_string($conn,$_POST['radio']);
$vs = mysqli_real_escape_string($conn,$_POST['vs']);
if (!isset($radio)) {
	header("Location: ../index.php?error=somehow_the_user_memed_me");
	exit();
}
$white = null;
$black = null;
$type = "STANDARD";
if ($radio == 'random') {
	if (rand(0,1) > 0) {
		$radio = 'white';
	} else {
		$radio = 'black';
	}
}
if ($radio == 'white') {
	if (isset($_SESSION['id'])) {
		$sesh_id = $_SESSION['id'];
		$sql = "SELECT * FROM user WHERE id='$sesh_id'";
		$result = mysqli_query($conn,$sql);
		$row = mysqli_fetch_assoc($result);
		$white = $row['username'];
	} else {
		$white = 'guest';
	}
	$black = 'computer';
} else if ($radio == 'black') {
	if (isset($_SESSION['id'])) {
		$sesh_id = $_SESSION['id'];
		$sql = "SELECT * FROM user WHERE id='$sesh_id'";
		$result = mysqli_query($conn,$sql);
		$row = mysqli_fetch_assoc($result);
		$black = $row['username'];
	} else {
		$black = 'guest';
	}
	$white = 'computer';
} 
$rslt = null;
$pgn = null;
function random_str($length, $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    $str = '';
    $max = mb_strlen($keyspace, '8bit') - 1;
    for ($i = 0; $i < $length; ++$i) {
        $str .= $keyspace[random_int(0, $max)];
    }
    return $str;
}
$url = null;
$stmt = null;
while (true) {
	$url = random_str(32);

	$stmt = $conn->prepare("SELECT url FROM games WHERE url=?");
	$stmt->bind_param("s",$url);
	$stmt->execute();
	$result = $stmt->get_result();
	if (mysqli_num_rows($result) > 0) {
		// echo "frick";
		echo "trying again...?";
	} else {
		// echo "frock";
		break;
	}
}
echo $url;
echo $type;
echo $white;
echo $black;
echo $rslt;
echo $pgn;
$stmt = $conn->prepare("INSERT INTO games (url, type, white, black, result, pgn) VALUES (?,?,?,?,?,?)");
$stmt->bind_param("ssssss",$url,$type,$white,$black,$rslt,$pgn);
$stmt->execute();
$result = $stmt->get_result();
// redirect to url of new game
echo "redirecting...";
header("Location: ../game.php?url=".$url);
exit();

?>