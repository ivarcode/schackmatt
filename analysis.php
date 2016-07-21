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
	<script type="text/javascript" src="./js/rules.js"></script>
	<script type="text/javascript">

		var IMAGES = {wPawn:new Image(),wRook:new Image(),wKnight:new Image(),wBishop:new Image(),wQueen:new Image(),wKing:new Image(),bPawn:new Image(),bRook:new Image(),bKnight:new Image(),bBishop:new Image(),bQueen:new Image(),bKing:new Image()};

		IMAGES.wPawn.src = "./img/pieces/w_Pawn.png";
		IMAGES.wRook.src = "./img/pieces/w_Rook.png";
		IMAGES.wKnight.src = "./img/pieces/w_Knight.png";
		IMAGES.wBishop.src = "./img/pieces/w_Bishop.png";
		IMAGES.wQueen.src = "./img/pieces/w_Queen.png";
		IMAGES.wKing.src = "./img/pieces/w_King.png";
		IMAGES.bPawn.src = "./img/pieces/b_Pawn.png";
		IMAGES.bRook.src = "./img/pieces/b_Rook.png";
		IMAGES.bKnight.src = "./img/pieces/b_Knight.png";
		IMAGES.bBishop.src = "./img/pieces/b_Bishop.png";
		IMAGES.bQueen.src = "./img/pieces/b_Queen.png";
		IMAGES.bKing.src = "./img/pieces/b_King.png";

		var board_canvas;
		var board_context;
		var SQ_DIM = 80;

		var selected_square;
		var tintSquare;
		var click_data = {src: null, dest: null, mSrc: null, mDest: null};
		var mouse_over_board = false;
		var current_mousePos = null;
		var mousedown = false;
		var queening = false;

		var board_img = new Image();
		board_img.src = "./img/board_" + SQ_DIM*8 + "x" + SQ_DIM*8 + ".png";


		var game = new Game("player 1","player 2","STANDARD","rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",[]);
		// game.print(true);



		function setup() {
			board_canvas = document.getElementById("board");
			board_context = board_canvas.getContext("2d");

			drawBoard();
			
			board_canvas.addEventListener('mousedown',function(events){
				

				/*mousedown*/



				click_data.mSrc = getMousePos(board_canvas,events);
				var s = getSquareFromMousePos(click_data.mSrc);
				console.log(s);
				
				if (selected_square != null) {
					if (s.x == selected_square.x && s.y == selected_square.y) {
						selected_square = null;
					} else {
						console.log("make move second click");
						game.make_move(new Move(selected_square,s,game.get_piece(selected_square)));
					}
				} else {
					if (game.get_piece(s) != null && game.get_piece(s).color == game.turn) {
						console.log("setting selected_square to "+s.x+","+s.y);
						selected_square = s;
					} else {
						selected_square = null;
					}
				}



				mousedown = true;
				drawBoard();
			});
			board_canvas.addEventListener('mouseup',function(events){


				if (selected_square != null) {
					click_data.mDest = getMousePos(board_canvas,events);
					var d = getSquareFromMousePos(click_data.mDest);
					if (selected_square.x == d.x && selected_square.y == d.y) {
						selected_square = null;
					} else {
						var move = new Move({x:selected_square.x,y:selected_square.y},{x:d.x,y:d.y},game.get_piece(selected_square));
						game.make_move(move,false);
						game.print(true);
						selected_square = null;
					}
				}


				mousedown = false;
				drawBoard();

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
					current_mousePos = getMousePos(board_canvas,events);
					var x = current_mousePos.x;
					var y = current_mousePos.y;
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

		function getMousePos(canvas,events) {
			/*returns an object {x,y} that contain the mousePos data from events on the canvas*/
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
			/*this function converts the mousePos data to a square on the chessboard*/
			var x = loc.x;
			var y = loc.y;
			x -= x%SQ_DIM;
			y -= y%SQ_DIM;
			x /= SQ_DIM;
			y /= SQ_DIM;
			return { x: 7-y, y: x };
		}

		function drawBoard() {
			/*function that loops through the board and draws the pieces, as well as highlights proper squares and handles dragged pieces*/
			board_context.globalALpha = 1;
			board_context.drawImage(board_img,0,0);
			if (mouse_over_board) {
				tintSq(tintSquare.x,tintSquare.y);
			}
			board_context.globalAlpha = 1;
			for (var i = 0; i < 8; i++) {
				for (var j = 0; j < 8; j++) {
					if (selected_square != null && mousedown) {
						if (i == selected_square.y && j == selected_square.x) {
							//dont draw, draw later
						} else {
							try {
								drawPiece(i*SQ_DIM,(7-j)*SQ_DIM,game.board[j][i]);
							} catch(e) {
								console.log("ERR :: "+e.message)
							}
						}
					} else {
						try {
							drawPiece(i*SQ_DIM,(7-j)*SQ_DIM,game.board[j][i]);
						} catch(e) {
							console.log("ERR :: "+e.message)
						}
					}
				}
			}
			if (selected_square != null && mousedown) {
				drawPiece(current_mousePos.x-40,current_mousePos.y-40,game.get_piece(selected_square));
			}
		}

		function drawPiece(x,y,piece) {
			/*draws one piece in the board at the coordinates given*/
			// console.log("drawPiece("+x+","+y+","+piece.type+")");
			if (piece == wPawn) { 
				board_context.drawImage(IMAGES.wPawn,x,y);
			} else if (piece == wKnight) { 
				board_context.drawImage(IMAGES.wKnight,x,y);
			} else if (piece == wBishop) { 
				board_context.drawImage(IMAGES.wBishop,x,y);
			} else if (piece == wRook) { 
				board_context.drawImage(IMAGES.wRook,x,y);
			} else if (piece == wQueen) { 
				board_context.drawImage(IMAGES.wQueen,x,y);
			} else if (piece == wKing) { 
				board_context.drawImage(IMAGES.wKing,x,y);
			} else if (piece == bPawn) { 
				board_context.drawImage(IMAGES.bPawn,x,y);
			} else if (piece == bKnight) { 
				board_context.drawImage(IMAGES.bKnight,x,y);
			} else if (piece == bBishop) { 
				board_context.drawImage(IMAGES.bBishop,x,y);
			} else if (piece == bRook) { 
				board_context.drawImage(IMAGES.bRook,x,y);
			} else if (piece == bQueen) { 
				board_context.drawImage(IMAGES.bQueen,x,y);
			} else if (piece == bKing) { 
				board_context.drawImage(IMAGES.bKing,x,y);
			} else {
				//draw nothing
			}
		}

		function tintSq(x,y) {
			/*function responsible for tinting squares yellow*/
			board_context.fillStyle = "yellow";
			board_context.globalAlpha = 0.5;
			if (selected_square != null) {
				if (!(selected_square.x == x && selected_square.y == y)) {
					board_context.fillRect(x*SQ_DIM,y*SQ_DIM,SQ_DIM,SQ_DIM);
				}
			} else {
				board_context.fillRect(x*SQ_DIM,y*SQ_DIM,SQ_DIM,SQ_DIM);
			}
		}

		function selSq(x,y) {
			/*function responsible for tinting sqs blue*/
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
			<h5 id="me">Coded by Camden I. Wagner<br>camden.i.wagner@ivarcode.net</h5>
		</div>

		<div id="game">
			
			<canvas id="board" width="640" height="640">canvas</canvas>

			<div id="game_data">
				<h3 id="materialBalance">null</h3>
			</div>

		</div>

		<div>
			<h4 id="FEN"></h4>
		</div>
	</div>
</body>
</html>