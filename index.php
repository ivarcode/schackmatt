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
				echo $_SESSION['id'];
			} else {
				echo "You are not logged in.";
			}
		?>

		<br><br>

	</div>

</div>

<?php
	include 'footer.php';
?>
