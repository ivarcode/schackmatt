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
				echo "<h5 style='float:right;'>member since ".$row['timestamp']."</h5><h2>".$row['username']."</h2><hr>";
			} else {
				// default guest homepage
				echo "You are not logged in.";
			}
		?>

		<br><br>

	</div>

</div>

<?php
	include 'footer.php';
?>
