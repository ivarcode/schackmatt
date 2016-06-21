<!DOCTYPE html>
<!-- 
	Website code for www.schackmatt.net
	Currently a work-in-progress
	Until there is some real work done, there will be very limited documentation. It will come though.

	analysis.php
	Camden I. Wagner
	6/20/2016
-->

<html>
<head>
	<title>Analysis Board</title>
	<link rel="stylesheet" href="style.css">

	<script type="text/javascript" src="./js/game.js"></script>
	<script type="text/javascript">

		var game = new game("Player 1", "Player 2", "STANDARD");

		console.log(game);

		var board_canvas;
		var board_context;
		var SQ_DIM = 80;

		var sq_is_selected = false;
		var selected_square;
		var tintSquare;
		var click_data = {src: null, dest: null};
		var mouse_over_board = false;

		var board_img = new Image();
		board_img.src = "./img/board_" + SQ_DIM*8 + "x" + SQ_DIM*8 + ".png";

		function setup() {
			board_canvas = document.getElementById("board");
			board_context = board_canvas.getContext("2d");

			drawBoard();
			
			board_canvas.addEventListener('mousedown',function(events){
				var mousePos = getMousePos(board_canvas,events);
				click_data.src = mousePos;
				console.log("mousedown at (" + mousePos.x + "," + mousePos.y + ")");
			});
			board_canvas.addEventListener('mouseup',function(events){
				var mousePos = getMousePos(board_canvas,events);
				click_data.dest = mousePos;
				console.log("mouseup at (" + mousePos.x + "," + mousePos.y + ")");
				var src = {x:click_data.src.x/SQ_DIM,y:click_data.src.y/SQ_DIM};
				var dest = {x:click_data.dest.x/SQ_DIM,y:click_data.dest.y/SQ_DIM};
				src = {x:src.x-(src.x%1),y:src.y-(src.y%1)};
				dest = {x:dest.x-(dest.x%1),y:dest.y-(dest.y%1)};
				console.log("src " + src.x + "," + src.y);
				console.log("dest " + dest.x + "," + dest.y);

				if (src.x == dest.x && src.y == dest.y) {
					console.log("selected_square");
				} else {
					makeMove(src,dest);
					console.log("makeMove");
				}

				// var move = new move(src,dest,null);

			});
			board_canvas.addEventListener('mouseenter',function(events){
				mouse_over_board = true;
			});
			board_canvas.addEventListener('mouseleave',function(events){
				mouse_over_board = false;
				for (var i = 0; i < 10; i++) { drawBoard(); /*looping drawBoard() to clear all tinting*/}
			});
			board_canvas.addEventListener('mousemove',function(events){
				if (mouse_over_board) {
					// console.log("mousemove mouse_over_board");
					var mousePos = getMousePos(board_canvas,events);
					var x = mousePos.x;
					var y = mousePos.y;
					x -= x%SQ_DIM;
					y -= y%SQ_DIM;
					// console.log("mousePos on canvas : " + x + " " + y);
					x /= SQ_DIM;
					y /= SQ_DIM;
					// console.log("mousePos on canvas / SQ_DIM : " + x + " " + y);
					tintSquare = {x:x, y:y};
					// console.log("mousemove");
					drawBoard();
				}
			});
		}

		function makeMove(src, dest) {
			game.board[7-dest.y][dest.x] = game.board[7-src.y][src.x];
			game.board[7-src.y][src.x] = nullpiece;
			if (game.turn == "WHITE") {
				game.turn = "BLACK";
			} else {
				game.turn = "WHITE";
			}
			console.log(game.turn + " turn");
			updatePGN(src,dest);
		}

		function updatePGN(src, dest) {
			// console.log(game.record.length);
			var notation = "";//TODO
			var piece = game.board[7-dest.y][dest.x];
			// console.log(piece.color + " " + piece.type);
			if (piece.type == "KING") {
				notation += "K";
			} else if (piece.type == "QUEEN") {
				notation += "Q";
			} else if (piece.type == "BISHOP") {
				notation += "B";
			} else if (piece.type == "KNIGHT") {
				notation += "N";
			} else if (piece.type == "ROOK") {
				notation += "R";
			} else {
				//add nothing
			}
			notation += pairToSq(dest);
			game.record[game.record.length] = {src:src,dest:dest,notation:notation};
			printPGN();
		}

		function pairToSq(sq) {
			var square = "";
			switch (sq.x) {
				case 0: square += "a"; break;
				case 1: square += "b"; break;
				case 2: square += "c"; break;
				case 3: square += "d"; break;
				case 4: square += "e"; break;
				case 5: square += "f"; break;
				case 6: square += "g"; break;
				case 7: square += "h"; break;
				default: console.log("sq out of range error");
			}
			square += 8-sq.y;
			return square;
		}

		function printPGN() {
			var pgn = "";
			for (var i = 0; i < game.record.length; i++) {
				pgn += game.record[i].notation + " ";
			}
			console.log("PGN :: " + pgn);
		}

		function getMousePos(canvas,events) {
			var obj = canvas;
			var top = 0, left = 0;
			var mX = 0, mY = 0;
			while (obj && obj.tagName != 'BODY') {
				top += obj.offsetTop;
				left += obj.offsetLeft;
				obj = obj.offsetParent;
			}
			mX = events.clientX - left + window.pageXOffset;
			mY = events.clientY - top + window.pageYOffset;
			return { x: mX, y: mY };
		}

		function getSquareFromMousePos(loc) {
			var x = loc.x;
			var y = loc.y;
			x -= x%SQ_DIM;
			y -= y%SQ_DIM;
			x /= SQ_DIM;
			y /= SQ_DIM;
			return { x: x, y: y };
		}

		function drawBoard() {
			board_context.globalALpha = 1;
			board_context.drawImage(board_img,0,0);
			if (mouse_over_board) {
				tintSq(tintSquare.x,tintSquare.y);
			}
			if (sq_is_selected) {
				selSq(selected_square.x,selected_square.y);
			}
			board_context.globalAlpha = 1;
			for (var i = 0; i < 8; i++) {
				for (var j = 0; j < 8; j++) {
					// console.log(game.board[j][i]);
					if (game.board[j][i] == wPawn) { 
						board_context.drawImage(IMAGES.wPawn,i*SQ_DIM,(7-j)*SQ_DIM);
					} else if (game.board[j][i] == wKnight) { 
						board_context.drawImage(IMAGES.wKnight,i*SQ_DIM,(7-j)*SQ_DIM);
					} else if (game.board[j][i] == wBishop) { 
						board_context.drawImage(IMAGES.wBishop,i*SQ_DIM,(7-j)*SQ_DIM);
					} else if (game.board[j][i] == wRook) { 
						board_context.drawImage(IMAGES.wRook,i*SQ_DIM,(7-j)*SQ_DIM);
					} else if (game.board[j][i] == wQueen) { 
						board_context.drawImage(IMAGES.wQueen,i*SQ_DIM,(7-j)*SQ_DIM);
					} else if (game.board[j][i] == wKing) { 
						board_context.drawImage(IMAGES.wKing,i*SQ_DIM,(7-j)*SQ_DIM);
					} else if (game.board[j][i] == bPawn) { 
						board_context.drawImage(IMAGES.bPawn,i*SQ_DIM,(7-j)*SQ_DIM);
					} else if (game.board[j][i] == bKnight) { 
						board_context.drawImage(IMAGES.bKnight,i*SQ_DIM,(7-j)*SQ_DIM);
					} else if (game.board[j][i] == bBishop) { 
						board_context.drawImage(IMAGES.bBishop,i*SQ_DIM,(7-j)*SQ_DIM);
					} else if (game.board[j][i] == bRook) { 
						board_context.drawImage(IMAGES.bRook,i*SQ_DIM,(7-j)*SQ_DIM);
					} else if (game.board[j][i] == bQueen) { 
						board_context.drawImage(IMAGES.bQueen,i*SQ_DIM,(7-j)*SQ_DIM);
					} else if (game.board[j][i] == bKing) { 
						board_context.drawImage(IMAGES.bKing,i*SQ_DIM,(7-j)*SQ_DIM);
					} else {
						//draw nothing
					}
				}
			}
		}

		function tintSq(x,y) {
			// console.log("tintSq " + x + "," + y);
			board_context.fillStyle = "yellow";
			board_context.globalAlpha = 0.5;
			if (sq_is_selected) {
				if (!(selected_square.x == x && selected_square.y == y)) {
					board_context.fillRect(x*SQ_DIM,y*SQ_DIM,SQ_DIM,SQ_DIM);
				}
			} else {
				board_context.fillRect(x*SQ_DIM,y*SQ_DIM,SQ_DIM,SQ_DIM);
			}
		}

		function selSq(x,y) {
			board_context.fillStyle = "blue";
			board_context.globalAlpha = 0.5;
			board_context.fillRect(x*SQ_DIM,y*SQ_DIM,SQ_DIM,SQ_DIM);
		}

		window.addEventListener('load', setup, false);

	</script>
</head>
<body>
	<div id="container">

		<div id="header">
			<h1>schackmatt.net</h1>
			<h3>WIP</h3>
			<h5>Coded by Camden I. Wagner<br>camden.i.wagner@ivarcode.net</h5>
		</div>

		<div id="game">
			
			<canvas id="board" width="640" height="640">canvas</canvas>

			<div id="game_data">
				<h3 id="materialBalance">null</h3>
			</div>

		</div>
	</div>
</body>
</html>