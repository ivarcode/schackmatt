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

		<!-- logout form -->
		<form action="includes/logout.inc.php">
			<button>LOGOUT</button>
		</form>

	</div>
	<div id="footer">
		
	</div>
</div>

</body>
</html>