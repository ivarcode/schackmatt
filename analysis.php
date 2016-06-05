<!DOCTYPE html>
<!-- 
	Website code for www.schackmatt.net
	Currently a work-in-progress
	Until there is some real work done, there will be very limited documentation. It will come though.

	analysis.php
	Camden I. Wagner
	5/11/2016
-->

<html>
<head>
	<title>Analysis Board</title>
	<link rel="stylesheet" href="style.css">

	<script type="text/javascript" src="./js/board.js"></script>
	<script type="text/javascript">

		var board = [];
		for (var i = 0; i < 8; i++) {
			board[i] = [];
			for (var j = 0; j < 8; j++) {
				board[i][j] = BOARD_STANDARD[j][i]; //flipping board axis
			}
		}
		printBoard();

		var board_canvas;
		var board_context;
		var SQ_DIM = 80;
		var board_img = new Image();
		board_img.src = "./img/board_" + SQ_DIM*8 + "x" + SQ_DIM*8 + ".png";

		var turn = "WHITE";

		var isMoveValid = false;
		var sq_is_selected = false;
		var selected_square;
		var tintSquare;
		var click_data = {src: null, dest: null};
		var mouse_over_board = false;

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
				var moveSrc = getSquareFromMousePos(click_data.src);
				var moveDest = getSquareFromMousePos(click_data.dest);
				if (!(click_data.src.x == click_data.dest.x && click_data.src.y == click_data.dest.y)) {
					isMoveValid = checkMove(moveSrc,moveDest);
					console.log("moveSrc = " + moveSrc.x + "," + moveSrc.y + "  moveDest = " + moveDest.x + "," + moveDest.y + "  isMoveValid = " + isMoveValid);
					if (isMoveValid) {
						makeMove(moveSrc,moveDest);
						console.log("board state after move " + moveSrc.x + "," + moveSrc.y + " --> " + moveDest.x + "," + moveDest.y);
						printBoard();
						// console.log("drag");
					}
				} else {
					if (sq_is_selected) {
						sq_is_selected = false;
						if (!(selected_square.x == moveSrc.x && selected_square.y == moveSrc.y)) {
							//do nothing
						} else {
							// TODO fix this for two click moving
							/*if (checkMove(selected_square,moveSrc)) {
								makeMove(selected_square,moveSrc);
								printBoard();
								console.log("two click");
							}*/
						}
					} else {
						sq_is_selected = true;
						selected_square = {x:moveSrc.x, y:moveSrc.y};
					}
				}
			});
			board_canvas.addEventListener('mouseenter',function(events){
				mouse_over_board = true;
			});
			board_canvas.addEventListener('mouseleave',function(events){
				mouse_over_board = false;
				for (var i = 0; i < 10; i++) { drawBoard(); }
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

		function printBoard() {
			for (var i = 0; i < 8; i++) {
				console.log(board[0][i] + board[1][i] + board[2][i] + board[3][i] + 
					board[4][i] + board[5][i] + board[6][i] + board[7][i]);
			}
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

		function checkMove(src,dest) {
			if (!(src.x == dest.x && src.y == dest.y)) {
				// console.log("!(src.x == dest.x && src.y == dest.y) == true");
				return isLegalMove(src,dest);
			}
			// console.log("!(src.x == dest.x && src.y == dest.y) == false");
			return false;
		}

		function isLegalMove(src,dest) {
			console.log("isLegalMove " + src.x + "," + src.y + " --> " + dest.x + "," + dest.y);
			var piece = board[src.x][src.y];
			var dest_piece = board[dest.x][dest.y];
			if ((piece == WHITE_PIECES.king || piece == WHITE_PIECES.queen || piece == WHITE_PIECES.bishop || piece == WHITE_PIECES.knight || piece == WHITE_PIECES.rook || piece == WHITE_PIECES.pawn) && turn == "WHITE" && isNotFriendly(dest_piece)) {
				if (piece == WHITE_PIECES.king) {

				} else if (piece == WHITE_PIECES.queen) {
					
				} else if (piece == WHITE_PIECES.bishop) {
					
				} else if (piece == WHITE_PIECES.knight) {
					
				} else if (piece == WHITE_PIECES.rook) {
					
				} else if (piece == WHITE_PIECES.pawn) {
					moves = getPawnMoves(board,src,turn);
					console.log(moves.branches.length);
					for (var i = 0; i < moves.branches.length; i++) {
						if (moves.branches[i].x == dest.x && moves.branches[i].y == dest.y) {
							console.log("TRUEx");
							return true;
						}
					}
				}
			} else if ((piece == BLACK_PIECES.king || piece == BLACK_PIECES.queen || piece == BLACK_PIECES.bishop || piece == BLACK_PIECES.knight || piece == BLACK_PIECES.rook || piece == BLACK_PIECES.pawn) && turn == "BLACK" && isNotFriendly(dest_piece)) {
				if (piece == BLACK_PIECES.king) {

				} else if (piece == BLACK_PIECES.queen) {
					
				} else if (piece == BLACK_PIECES.bishop) {
					
				} else if (piece == BLACK_PIECES.knight) {
					
				} else if (piece == BLACK_PIECES.rook) {
					
				} else if (piece == BLACK_PIECES.pawn) {
					moves = getPawnMoves(board,src,turn);
					console.log(moves.branches.length);
					for (var i = 0; i < moves.branches.length; i++) {
						if (moves.branches[i].x == dest.x && moves.branches[i].y == dest.y) {
							return true;
						}
					}
				}
			}
			// else
			return false;
		}

		function makeMove(src,dest) {
			if (turn == "WHITE") {
				turn = "BLACK";
			} else {
				turn = "WHITE";
			}
			console.log("turn = " + turn);
			var piece = board[src.x][src.y];
			// console.log(piece);
			board[src.x][src.y] = NULL_PIECE;
			board[dest.x][dest.y] = piece;
		}

		function drawBoard() {
			board_context.globalAlpha = 1;
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
					if (board[i][j] == WHITE_PIECES.pawn) { board_context.drawImage(IMAGES.wPawn,i*SQ_DIM,j*SQ_DIM); }
					else if (board[i][j] == WHITE_PIECES.rook) { board_context.drawImage(IMAGES.wRook,i*SQ_DIM,j*SQ_DIM); }
					else if (board[i][j] == WHITE_PIECES.knight) { board_context.drawImage(IMAGES.wKnight,i*SQ_DIM,j*SQ_DIM); }
					else if (board[i][j] == WHITE_PIECES.bishop) { board_context.drawImage(IMAGES.wBishop,i*SQ_DIM,j*SQ_DIM); }
					else if (board[i][j] == WHITE_PIECES.queen) { board_context.drawImage(IMAGES.wQueen,i*SQ_DIM,j*SQ_DIM); }
					else if (board[i][j] == WHITE_PIECES.king) { board_context.drawImage(IMAGES.wKing,i*SQ_DIM,j*SQ_DIM); }
					else if (board[i][j] == BLACK_PIECES.pawn) { board_context.drawImage(IMAGES.bPawn,i*SQ_DIM,j*SQ_DIM); }
					else if (board[i][j] == BLACK_PIECES.rook) { board_context.drawImage(IMAGES.bRook,i*SQ_DIM,j*SQ_DIM); }
					else if (board[i][j] == BLACK_PIECES.knight) { board_context.drawImage(IMAGES.bKnight,i*SQ_DIM,j*SQ_DIM); }
					else if (board[i][j] == BLACK_PIECES.bishop) { board_context.drawImage(IMAGES.bBishop,i*SQ_DIM,j*SQ_DIM); }
					else if (board[i][j] == BLACK_PIECES.queen) { board_context.drawImage(IMAGES.bQueen,i*SQ_DIM,j*SQ_DIM); }
					else if (board[i][j] == BLACK_PIECES.king) { board_context.drawImage(IMAGES.bKing,i*SQ_DIM,j*SQ_DIM); }
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

			</div>

		</div>
	</div>
</body>
</html>