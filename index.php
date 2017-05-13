<!--
index.php
-->

<?php
	include 'header.php';
?>

<div id="container">
	
	<div id="content">

		<?php
			if (isset($_SESSION['id'])) {
				// getting the data from the user that is logged in
				$sesh_id = $_SESSION['id'];
				$sql = "SELECT * FROM user WHERE id='$sesh_id'";
				$result = mysqli_query($conn,$sql);
				$row = mysqli_fetch_assoc($result);
				echo "<h5 style='float:right;'>member since ".$row['timestamp']."</h5><h2>".$row['username']."</h2>";
			} else {
				// default guest homepage
				// echo "You are not logged in.";
				echo "ye ik the nav buttons for the pgn dont work.. if you find any other bugs pls report";
			}
		?>

		<br><hr><br>

		<?php
			include 'boards/analysis_board.php';
		?>

	</div>

</div>

<?php
	include 'footer.php';
?>
