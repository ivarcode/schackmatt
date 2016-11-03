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
	<script type="text/javascript" src="./js/bots/bot_gerald.js"></script>
	
	<script type="text/javascript">

		var IMAGES = {wPawn:new Image(),wRook:new Image(),wKnight:new Image(),wBishop:new Image(),wQueen:new Image(),wKing:new Image(),bPawn:new Image(),bRook:new Image(),bKnight:new Image(),bBishop:new Image(),bQueen:new Image(),bKing:new Image(),arrow:new Image()};

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
		IMAGES.arrow.src = "./img/arrow.png";

		var board_canvas;
		var board_context;
		var SQ_DIM = 80;

		var strategic_draws = []; // for lack of a better name for this variable, I am sure one will come to me

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
		// var game = new Game("player 1","player 2","TEST","8/8/p7/8/8/2Q5/3RkPK1/8 b - - 3 59",[]);

		// bot function calculations here
		// calculate_tree(game);



		game.print(true);


		function setup() {
			board_canvas = document.getElementById("board");
			// disables default context menu on rightclick on board
			board_canvas.oncontextmenu = function(events) {
    			events.preventDefault();
    		};
			board_context = board_canvas.getContext("2d");

			drawBoard();

			// setting HTML elements
			setHTMLElements();
			
			board_canvas.addEventListener('mousedown',function(events){
				
				// collect src sq from events
				click_data.mSrc = getMousePos(board_canvas,events);
				var s = getSquareFromMousePos(click_data.mSrc);
				console.log("src sq = "+s.x+","+s.y);

				if (events.button === 0 /*left mousebutton pressed*/) {
					selected_square = s;
					// clear strategic_draws array
					strategic_draws = [];
				} else if (events.button === 2 /*right mousebutton pressed*/) {
					// add mousedown src and null dest object to the end of the strategic_draws array
					strategic_draws[strategic_draws.length] = {src:s,dest:null};
				}

				mousedown = true;

			});
			board_canvas.addEventListener('mouseup',function(events){

				// collect dest sq from events
				click_data.mDest = getMousePos(board_canvas,events);
				var d = getSquareFromMousePos(click_data.mDest);
				console.log("dest sq = "+d.x+","+d.y);

				// if strategic_draws latest entry has a src, but a null dest
				if (strategic_draws.length > 0 && strategic_draws[strategic_draws.length-1].src != null && strategic_draws[strategic_draws.length-1].dest == null) {
					var does_not_exist_already = true;
					var index_of_existing_element = null;
					// check to see if that draw already exists
					for (var i = 0; i < strategic_draws.length; i++) {
						if (i == strategic_draws.length-1) {
							if (does_not_exist_already) {
								// set the dest to d bc that means the right mouse button was down
								strategic_draws[strategic_draws.length-1].dest = d;
								break;
							} else {
								// console.log("splicing @ "+i+" and end");
								strategic_draws.splice(strategic_draws.length-1,1);
								strategic_draws.splice(index_of_existing_element,1);
								// console.log(strategic_draws);
								i--;
								break;
							}
						} else if (strategic_draws[i].src.x == strategic_draws[strategic_draws.length-1].src.x && strategic_draws[i].src.y == strategic_draws[strategic_draws.length-1].src.y && strategic_draws[i].dest.x == d.x && strategic_draws[i].dest.y == d.y) {
							does_not_exist_already = false;
							index_of_existing_element = i;
						}
					}
				} else /*if selected_square is not null*/ if (selected_square != null) {
					var move_data = {src:selected_square,dest:d};
					// console.log(move_data);
					var current_board = board_from_FEN(game.get_FEN());
					print_board(current_board);
					// check move legality
					var legal_moves = get_legal_moves(game.get_FEN());
					console.log(legal_moves);
					var move_is_legal = false;
					var move_index = null;
					for (var n = 0; n < legal_moves.length; n++) {
						if (move_data.src.x == legal_moves[n].src.x && move_data.src.y == legal_moves[n].src.y && move_data.dest.x == legal_moves[n].dest.x && move_data.dest.y == legal_moves[n].dest.y) {
							console.log("move is legal");
							move_is_legal = true;
							move_index = n;
						}
					}
					// make move if it is legal
					if (move_is_legal) {
						game.set_FEN(legal_moves[move_index].position);
						setHTMLElements();
					}
				}

				mousedown = false;

			});
			board_canvas.addEventListener('mouseenter',function(events){
				mouse_over_board = true;
			});
			board_canvas.addEventListener('mouseleave',function(events){
				mouse_over_board = false;
				drawBoard();
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
			var board = board_from_FEN(game.get_FEN());

			board_context.globalAlpha = 1;
			board_context.restore();
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
								drawPiece(i*SQ_DIM,(7-j)*SQ_DIM,board[j][i]);
							} catch(e) {
								console.log("ERR :: "+e.message)
							}
						}
					} else {
						try {
							drawPiece(i*SQ_DIM,(7-j)*SQ_DIM,board[j][i]);
						} catch(e) {
							console.log("ERR :: "+e.message)
						}
					}
				}
			}
			if (selected_square != null && mousedown) {
				// console.log("drawing piece on mouse");
				drawPiece(current_mousePos.x-40,current_mousePos.y-40,game.get_piece(selected_square));
			}
			// draw strategic_draws
			// console.log("number of strategic_draws = "+strategic_draws.length);
			board_context.globalAlpha = 0.6;
			board_context.fillStyle = "#14B21D";
			for (var i = 0; i < strategic_draws.length; i++) {
				// if src and dest of the index are the same
				if (strategic_draws[i].dest != null && strategic_draws[i].src.x == strategic_draws[i].dest.x && strategic_draws[i].src.y == strategic_draws[i].dest.y) {
					// draw a box type select to "highlight individual sq"
					var y = 7-strategic_draws[i].src.x;
					var x = strategic_draws[i].src.y;
					board_context.fillRect((x*SQ_DIM)+5,(y*SQ_DIM)+5,5,30);
					board_context.fillRect((x*SQ_DIM)+10,(y*SQ_DIM)+5,25,5);
					board_context.fillRect((x*SQ_DIM)+45,(y*SQ_DIM)+5,30,5);
					board_context.fillRect((x*SQ_DIM)+70,(y*SQ_DIM)+10,5,25);
					board_context.fillRect((x*SQ_DIM)+5,(y*SQ_DIM)+45,5,30);
					board_context.fillRect((x*SQ_DIM)+10,(y*SQ_DIM)+70,25,5);
					board_context.fillRect((x*SQ_DIM)+45,(y*SQ_DIM)+70,30,5);
					board_context.fillRect((x*SQ_DIM)+70,(y*SQ_DIM)+45,5,25);
				} else if (strategic_draws[i].dest != null) {
					// draw an arrow from src to dest
					var src = strategic_draws[i].src;
					var dest = strategic_draws[i].dest;
					var deltaX = dest.x - src.x;
					var deltaY = dest.y - src.y;
					var arrow_width = 80;
					var arrow_height = (deltaX*80*deltaX*80)+(deltaY*80*deltaY*80);
					arrow_height = Math.sqrt(arrow_height);
					var rad = Math.atan2(deltaY,deltaX);
					// console.log(rad);
					var tranx = src.y*SQ_DIM;
					var trany = (7-src.x)*SQ_DIM;
					board_context.translate(tranx,trany);
					// board_context.translate(deltaY*40,(7-deltaX)*40);
					// board_context.translate(arrow_width/2,arrow_height/2);
					// board_context.translate(40,40);
					board_context.rotate(rad);
					board_context.drawImage(IMAGES.arrow,0,0,arrow_width,arrow_height);
					board_context.rotate(-rad);
					board_context.translate(-tranx,-trany);
					// board_context.translate(-(deltaY*40),-((7-deltaX)*40));
					// board_context.translate(-(arrow_width/2),-(arrow_height/2));
					// board_context.translate(-40,-40);
				} else {
					// strategic_draws[i] does not contain enough information to be drawn, so skip
				}
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
				//boolean to decide whether coordinate drawing is turned on
				var draw_coordinates = false;
				
				if (draw_coordinates) {
					//draw coordinate
					var a = x/80;
					var b = y/80;
					var coord = "";
					switch (a) {
						case 0: coord += "a";break;
						case 1: coord += "b";break;
						case 2: coord += "c";break;
						case 3: coord += "d";break;
						case 4: coord += "e";break;
						case 5: coord += "f";break;
						case 6: coord += "g";break;
						case 7: coord += "h";break;
					}
					coord += 8-b;
					board_context.font = "20px lucida console";
					board_context.strokeText(coord,x+30,y+50);
				}
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

		function setHTMLElements() {
			/*sets the HTML elements associated with the game data*/
			document.getElementById("FEN").innerHTML = game.get_FEN();
			if (calculate_material_balance(game.get_FEN()) > 0) {
				document.getElementById("materialBalance").innerHTML = "material balance = +"+calculate_material_balance(game.get_FEN());
			} else {
				document.getElementById("materialBalance").innerHTML = "material balance = "+calculate_material_balance(game.get_FEN());
			}
		}

		window.addEventListener('load', setup, false);

	</script>
</head>
<body>

	<div id="nav">
		<p>v0.1</p>
	</div>

	<center><h1>schackmatt.net</h1></center>
	<center><h2>analysis board</h2></center>

	<section id="cover" name="cover">

		

		<div id="game">
			
			<canvas id="board" width="640" height="640">canvas</canvas>

			<div id="game_data">
				<h3 id="materialBalance">null</h3>
			</div>

			<div>
				<h4 id="FEN">fen placeholder</h4>
			</div>

		</div>

		
	</section>

	<div id="controls">
		<p>Controls:<br>drag &amp; drop piece movement<br>right-click for drawing (currently works on individual squares only)</p>
		<p><a href="https://github.com/ivarcode/schackmatt">Source Code</a> - WORK IN PROGRESS<br>Please contact <i>camden.i.wagner@ivarcode.net</i> with suggestions or feedback of any kind.</p>
	</div>

</body>
</html>