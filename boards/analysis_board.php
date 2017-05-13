<!--
analysis_board.php
-->


<!-- game.js file - full script file for the game object and methods associated with manipulating the game -->
<script type="text/javascript" src="./js/game.js?<?php echo time(); ?>"></script>
<!-- local script on analysis_board.php that displays the game with a user interface -->
<script type="text/javascript">

var board_canvas;
var board_context;
var SQ_DIM = 80;

var strategic_draws = []; // for lack of a better name for this variable, I am sure one will come to me

var selected_square;
var tint_square;
var click_data = {src: null, dest: null, mSrc: null, mDest: null};
var mouse_over_board = false;
var current_mouse_pos = null;
var mousedown = false;
var promoting = false;
var promoting_to = null;

var board_img = new Image();
board_img.src = "./assets/board_" + SQ_DIM*8 + "x" + SQ_DIM*8 + ".png";


// initializing a standard game
// var game = new Game("player_one","player_two","STANDARD","rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",[]);
var game = new Game("player_one","player_two","STANDARD","2k2r2/6PP/8/6K1/8/8/4p3/8 w - - 1 18",[]);
print_game_info(game);


function setup() {
	board_canvas = document.getElementById("board");
	// disables default context menu on rightclick on board
	board_canvas.oncontextmenu = function(events) {
		events.preventDefault();
	};
	board_context = board_canvas.getContext("2d");

	draw_board();

	// setting HTML elements
	set_HTML_elements();
	
	board_canvas.addEventListener('mousedown',function(events){
		
		// collect src sq from events
		click_data.mSrc = get_mouse_pos(board_canvas,events);
		var s = get_sq_from_mouse_pos(click_data.mSrc);
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
		click_data.mDest = get_mouse_pos(board_canvas,events);
		var d = get_sq_from_mouse_pos(click_data.mDest);
		console.log("dest sq = "+d.x+","+d.y);

		// if strategic_draws latest entry has a src, but a null dest
		if (strategic_draws.length > 0 && strategic_draws[strategic_draws.length-1].src != null && strategic_draws[strategic_draws.length-1].dest == null) {
			var does_not_exist_already = true;
			var index_of_existing_element = null;
			// check to see if that draw already exists
			for (var i = 0; i < strategic_draws.length; i++) {
				// if we are ready to add the draw to the end
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
				} else if /*if the arrow has already been drawn from src -> dest or from dest -> src*/ ((strategic_draws[i].src.x == strategic_draws[strategic_draws.length-1].src.x && strategic_draws[i].src.y == strategic_draws[strategic_draws.length-1].src.y && strategic_draws[i].dest.x == d.x && strategic_draws[i].dest.y == d.y) || (strategic_draws[i].dest.x == strategic_draws[strategic_draws.length-1].src.x && strategic_draws[i].dest.y == strategic_draws[strategic_draws.length-1].src.y && strategic_draws[i].src.x == d.x && strategic_draws[i].src.y == d.y)) {
					does_not_exist_already = false;
					index_of_existing_element = i;
				}
			}
		} else /*if selected_square is not null*/ if (selected_square != null) {
			var move_data = {src:selected_square,dest:d};
			// console.log(move_data);
			var current_board = get_board_from_fen(game.fen);
			print_board_from_fen(game.fen);
			// check move legality
			var legal_moves = get_legal_moves(game.fen);
			// console.log("LEGAL MOVES");
			console.log(legal_moves);
			var move_is_legal = false;
			var move_index = null;
			for (var n = 0; n < legal_moves.length; n++) {
				// console.log(" "+n+"  "+move_data.src.x+","+move_data.src.y+"  "+move_data.dest.x+","+move_data.dest.y+"\n "+n+"  "+legal_moves[n].src.rank+","+legal_moves[n].src.file+"  "+legal_moves[n].dest.rank+","+legal_moves[n].dest.file);
				if (move_data.src.x == legal_moves[n].src.rank && move_data.src.y == legal_moves[n].src.file && move_data.dest.x == legal_moves[n].dest.rank && move_data.dest.y == legal_moves[n].dest.file) {
					// console.log("move is legal");
					if (!move_is_legal) {
						move_is_legal = true;
					} else {
						promoting = true;
						promoting_to = move_data.dest;
						// console.log("PROMOTING");
					}
					move_index = n;
				}
			}
			// make move if it is legal and we are not promoting (waiting for a second click to determine what piece to promote)
			if (move_is_legal && !promoting) {
				// print_move(legal_moves[move_index]);
				update_position(game,legal_moves[move_index]);
				set_HTML_elements();
				print_game_info(game);
				draw_board();//excessive redraw??
			} else if (promoting) {
				// white is promoting
				if (promoting_to.x == 7) {
					if (move_data.src.x == 7 && move_data.src.y == promoting_to.y && move_data.dest.x == 7 && move_data.dest.y == promoting_to.y) {
						for (var n = 0; n < legal_moves.length; n++) {
							if (legal_moves[n].piece == 'Q' && legal_moves[n].dest.rank == 7 && legal_moves[n].dest.file == promoting_to.y && get_piece(current_board,{x:legal_moves[n].src.rank,y:legal_moves[n].src.file}) == 'P') {
								promoting_to = null;
								promoting = false;
								update_position(game,legal_moves[n]);
								set_HTML_elements();
								print_game_info(game);
								break;
							}
						}
					}
					if (move_data.src.x == 6 && move_data.src.y == promoting_to.y && move_data.dest.x == 6 && move_data.dest.y == promoting_to.y) {
						for (var n = 0; n < legal_moves.length; n++) {
							if (legal_moves[n].piece == 'N' && legal_moves[n].dest.rank == 7 && legal_moves[n].dest.file == promoting_to.y && get_piece(current_board,{x:legal_moves[n].src.rank,y:legal_moves[n].src.file}) == 'P') {
								promoting_to = null;
								promoting = false;
								update_position(game,legal_moves[n]);
								set_HTML_elements();
								print_game_info(game);
								break;
							}
						}
					}
					if (move_data.src.x == 5 && move_data.src.y == promoting_to.y && move_data.dest.x == 5 && move_data.dest.y == promoting_to.y) {
						for (var n = 0; n < legal_moves.length; n++) {
							if (legal_moves[n].piece == 'R' && legal_moves[n].dest.rank == 7 && legal_moves[n].dest.file == promoting_to.y && get_piece(current_board,{x:legal_moves[n].src.rank,y:legal_moves[n].src.file}) == 'P') {
								promoting_to = null;
								promoting = false;
								update_position(game,legal_moves[n]);
								set_HTML_elements();
								print_game_info(game);
								break;
							}
						}
					}
					if (move_data.src.x == 4 && move_data.src.y == promoting_to.y && move_data.dest.x == 4 && move_data.dest.y == promoting_to.y) {
						for (var n = 0; n < legal_moves.length; n++) {
							if (legal_moves[n].piece == 'B' && legal_moves[n].dest.rank == 7 && legal_moves[n].dest.file == promoting_to.y && get_piece(current_board,{x:legal_moves[n].src.rank,y:legal_moves[n].src.file}) == 'P') {
								promoting_to = null;
								promoting = false;
								update_position(game,legal_moves[n]);
								set_HTML_elements();
								print_game_info(game);
								break;
							}
						}
					}
				} else // black is promoting
				if (promoting_to.x == 0) {
					if (move_data.src.x == 0 && move_data.src.y == promoting_to.y && move_data.dest.x == 0 && move_data.dest.y == promoting_to.y) {
						for (var n = 0; n < legal_moves.length; n++) {
							if (legal_moves[n].piece == 'q' && legal_moves[n].dest.rank == 0 && legal_moves[n].dest.file == promoting_to.y && get_piece(current_board,{x:legal_moves[n].src.rank,y:legal_moves[n].src.file}) == 'p') {
								promoting_to = null;
								promoting = false;
								update_position(game,legal_moves[n]);
								set_HTML_elements();
								print_game_info(game);
								break;
							}
						}
					}
					if (move_data.src.x == 1 && move_data.src.y == promoting_to.y && move_data.dest.x == 1 && move_data.dest.y == promoting_to.y) {
						for (var n = 0; n < legal_moves.length; n++) {
							if (legal_moves[n].piece == 'n' && legal_moves[n].dest.rank == 0 && legal_moves[n].dest.file == promoting_to.y && get_piece(current_board,{x:legal_moves[n].src.rank,y:legal_moves[n].src.file}) == 'p') {
								promoting_to = null;
								promoting = false;
								update_position(game,legal_moves[n]);
								set_HTML_elements();
								print_game_info(game);
								break;
							}
						}
					}
					if (move_data.src.x == 2 && move_data.src.y == promoting_to.y && move_data.dest.x == 2 && move_data.dest.y == promoting_to.y) {
						for (var n = 0; n < legal_moves.length; n++) {
							if (legal_moves[n].piece == 'r' && legal_moves[n].dest.rank == 0 && legal_moves[n].dest.file == promoting_to.y && get_piece(current_board,{x:legal_moves[n].src.rank,y:legal_moves[n].src.file}) == 'p') {
								promoting_to = null;
								promoting = false;
								update_position(game,legal_moves[n]);
								set_HTML_elements();
								print_game_info(game);
								break;
							}
						}
					}
					if (move_data.src.x == 3 && move_data.src.y == promoting_to.y && move_data.dest.x == 3 && move_data.dest.y == promoting_to.y) {
						for (var n = 0; n < legal_moves.length; n++) {
							if (legal_moves[n].piece == 'b' && legal_moves[n].dest.rank == 0 && legal_moves[n].dest.file == promoting_to.y && get_piece(current_board,{x:legal_moves[n].src.rank,y:legal_moves[n].src.file}) == 'p') {
								promoting_to = null;
								promoting = false;
								update_position(game,legal_moves[n]);
								set_HTML_elements();
								print_game_info(game);
								break;
							}
						}
					}
				}
				draw_board();//excessive redraw??
			}
		}

		mousedown = false;
		draw_board();

	});	
	board_canvas.addEventListener('mouseenter',function(events){
		mouse_over_board = true;
	});
	board_canvas.addEventListener('mouseleave',function(events){
		mouse_over_board = false;
		draw_board();
	});
	board_canvas.addEventListener('mousemove',function(events){
		if (mouse_over_board) {
			current_mouse_pos = get_mouse_pos(board_canvas,events);
			var x = current_mouse_pos.x;
			var y = current_mouse_pos.y;
			x -= x%SQ_DIM;
			y -= y%SQ_DIM;
			// console.log("mousePos on canvas : " + x + " " + y);
			x /= SQ_DIM;
			y /= SQ_DIM;
			// console.log("mousePos on canvas / SQ_DIM : " + x + " " + y);
			tint_square = {x:x, y:y};
			// console.log("mousemove");
			draw_board();
		}
	});
}

function get_mouse_pos(canvas,events) {
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

function get_sq_from_mouse_pos(loc) {
	/*this function converts the mousePos data to a square on the chessboard*/
	var x = loc.x;
	var y = loc.y;
	x -= x%SQ_DIM;
	y -= y%SQ_DIM;
	x /= SQ_DIM;
	y /= SQ_DIM;
	return { x: 7-y, y: x };
}

function draw_board() {
	/*function that loops through the board and draws the pieces, as well as highlights proper squares and handles dragged pieces*/
	var board = get_board_from_fen(game.fen);

	board_context.globalAlpha = 1;
	board_context.restore();
	board_context.drawImage(board_img,0,0);
	if (mouse_over_board) {
		tint_sq(tint_square.x,tint_square.y,"yellow",0.7);
	}
	board_context.globalAlpha = 1;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (selected_square != null && mousedown) {
				if (i == selected_square.y && j == selected_square.x) {
					//dont draw, draw later
				} else {
					try {
						draw_piece(i*SQ_DIM,(7-j)*SQ_DIM,board[j][i]);
					} catch(e) {
						console.log("ERR :: "+e.message)
					}
				}
			} else {
				try {
					draw_piece(i*SQ_DIM,(7-j)*SQ_DIM,board[j][i]);
				} catch(e) {
					console.log("ERR :: "+e.message)
				}
			}
		}
	}
	if (selected_square != null && mousedown) {
		// console.log("drawing piece on mouse");
		draw_piece(current_mouse_pos.x-40,current_mouse_pos.y-40,get_piece(board,selected_square));
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
			draw_arrow(src,dest);
		} else {
			// draw "hover arrow" here (the arrow the user is currently in the process of drawing, ie. mousedown == true but mouseup hasnt set a dest yet)
			var src = strategic_draws[i].src;
			var dest = get_sq_from_mouse_pos(current_mouse_pos);
			if (!(src.x == dest.x && src.y == dest.y)) {
				draw_arrow(src,dest);
			}
		}
	}

	// if promoting, draw promotion options
	if (promoting) {
		if (promoting_to.x == 7) {
			tint_sq(promoting_to.y,(7-promoting_to.x),"green",0.8);
			tint_sq(promoting_to.y,(8-promoting_to.x),"green",0.8);
			tint_sq(promoting_to.y,(9-promoting_to.x),"green",0.8);
			tint_sq(promoting_to.y,(10-promoting_to.x),"green",0.8);
			draw_piece(promoting_to.y*SQ_DIM,(7-promoting_to.x)*SQ_DIM,'Q');
			draw_piece(promoting_to.y*SQ_DIM,((7-promoting_to.x)*SQ_DIM)+SQ_DIM,'N');
			draw_piece(promoting_to.y*SQ_DIM,((7-promoting_to.x)*SQ_DIM)+(SQ_DIM*2),'R');
			draw_piece(promoting_to.y*SQ_DIM,((7-promoting_to.x)*SQ_DIM)+(SQ_DIM*3),'B');
		} else if (promoting_to.x == 0) {
			tint_sq(promoting_to.y,promoting_to.x+7,"green",0.8);
			tint_sq(promoting_to.y,promoting_to.x+6,"green",0.8);
			tint_sq(promoting_to.y,promoting_to.x+5,"green",0.8);
			tint_sq(promoting_to.y,promoting_to.x+4,"green",0.8);
			draw_piece(promoting_to.y*SQ_DIM,(promoting_to.x+7)*SQ_DIM,'q');
			draw_piece(promoting_to.y*SQ_DIM,(promoting_to.x+6)*SQ_DIM,'n');
			draw_piece(promoting_to.y*SQ_DIM,(promoting_to.x+5)*SQ_DIM,'r');
			draw_piece(promoting_to.y*SQ_DIM,(promoting_to.x+4)*SQ_DIM,'b');
		}
	}

	// draw arrows for legal moves
	if (mouse_over_board) {
		var m = get_legal_moves(game.fen);
		// console.log("draw legal moves on board");
		for (var i = 0; i < m.length; i++) {
			// console.log(m[i]);
			var cms = get_sq_from_mouse_pos(current_mouse_pos);
			// console.log(cms);
			if (m[i].src.rank == cms.x && m[i].src.file == cms.y) {
				draw_move_arrow(m[i].src,m[i].dest);
			}
		}
	}
}

function draw_move_arrow(src,dest) {
	/*function that draws an arrow to the board after doing all the angle and length calculations*/
	var deltaX = dest.rank - src.rank;
	var deltaY = dest.file - src.file;
	var arrow_width = 80;
	var arrow_height = (deltaX*80*deltaX*80)+(deltaY*80*deltaY*80);
	arrow_height = Math.sqrt(arrow_height);
	var rad = Math.atan2(deltaY,deltaX);
	// console.log(rad);
	var tranx = Math.max(src.rank,dest.rank);
	var trany = Math.min(src.file,dest.file);
	// console.log(tranx,trany);
	var a = trany*SQ_DIM;
	var b = (7-tranx)*SQ_DIM;
	// board_context.fillRect(a,b,5,5);
	board_context.translate(a,b);
	// board_context.fillRect(5,5,5,5);
	// console.log("deltaX = "+deltaX+" deltaY = "+deltaY);
	var cY = (deltaY*40);
	var cX = (deltaX*40);
	if (deltaX >= 0) {
		// do nothing
		if (deltaY >= 0) {
			// do nothing
		} else {
			cY = -cY;
		}
	} else {
		cX = -cX;
		if (deltaY >= 0) {
			// do nothing
		} else {
			cY = -cY;
		}
	}
	board_context.translate(cY+40,cX+40);
	// board_context.fillRect(0,0,5,5);
	// board_context.translate(arrow_width/2,arrow_height/2);
	// board_context.translate(40,40);
	board_context.rotate(rad);
	board_context.drawImage(IMAGES.arrow,-(arrow_width/2),-(arrow_height/2),arrow_width,SQ_DIM);
	board_context.drawImage(IMAGES.shaft,-(arrow_width/2),-(arrow_height/2)+SQ_DIM,arrow_width,arrow_height-SQ_DIM);
	
	board_context.rotate(-rad);
	board_context.translate(-a,-b);
	board_context.translate(-(cY+40),-(cX+40));
	// board_context.translate(-(deltaY*40),-((7-deltaX)*40));
	// board_context.translate(-(arrow_width/2),-(arrow_height/2));
	// board_context.translate(-40,-40);
}

function draw_arrow(src,dest) {
	/*function that draws an arrow to the board after doing all the angle and length calculations*/
	var deltaX = dest.x - src.x;
	var deltaY = dest.y - src.y;
	var arrow_width = 80;
	var arrow_height = (deltaX*80*deltaX*80)+(deltaY*80*deltaY*80);
	arrow_height = Math.sqrt(arrow_height);
	var rad = Math.atan2(deltaY,deltaX);
	// console.log(rad);
	var tranx = Math.max(src.x,dest.x);
	var trany = Math.min(src.y,dest.y);
	// console.log(tranx,trany);
	var a = trany*SQ_DIM;
	var b = (7-tranx)*SQ_DIM;
	// board_context.fillRect(a,b,5,5);
	board_context.translate(a,b);
	// board_context.fillRect(5,5,5,5);
	// console.log("deltaX = "+deltaX+" deltaY = "+deltaY);
	var cY = (deltaY*40);
	var cX = (deltaX*40);
	if (deltaX >= 0) {
		// do nothing
		if (deltaY >= 0) {
			// do nothing
		} else {
			cY = -cY;
		}
	} else {
		cX = -cX;
		if (deltaY >= 0) {
			// do nothing
		} else {
			cY = -cY;
		}
	}
	board_context.translate(cY+40,cX+40);
	// board_context.fillRect(0,0,5,5);
	// board_context.translate(arrow_width/2,arrow_height/2);
	// board_context.translate(40,40);
	board_context.rotate(rad);
	board_context.drawImage(IMAGES.arrow,-(arrow_width/2),-(arrow_height/2),arrow_width,SQ_DIM);
	board_context.drawImage(IMAGES.shaft,-(arrow_width/2),-(arrow_height/2)+SQ_DIM,arrow_width,arrow_height-SQ_DIM);
	
	board_context.rotate(-rad);
	board_context.translate(-a,-b);
	board_context.translate(-(cY+40),-(cX+40));
	// board_context.translate(-(deltaY*40),-((7-deltaX)*40));
	// board_context.translate(-(arrow_width/2),-(arrow_height/2));
	// board_context.translate(-40,-40);
}

function draw_piece(x,y,piece) {
	/*draws one piece in the board at the coordinates given*/
	// console.log("draw_piece("+x+","+y+","+piece.type+")");
	if (piece == 'P') { 
		board_context.drawImage(IMAGES.wPawn,x,y);
	} else if (piece == 'N') { 
		board_context.drawImage(IMAGES.wKnight,x,y);
	} else if (piece == 'B') { 
		board_context.drawImage(IMAGES.wBishop,x,y);
	} else if (piece == 'R') { 
		board_context.drawImage(IMAGES.wRook,x,y);
	} else if (piece == 'Q') { 
		board_context.drawImage(IMAGES.wQueen,x,y);
	} else if (piece == 'K') { 
		board_context.drawImage(IMAGES.wKing,x,y);
	} else if (piece == 'p') { 
		board_context.drawImage(IMAGES.bPawn,x,y);
	} else if (piece == 'n') { 
		board_context.drawImage(IMAGES.bKnight,x,y);
	} else if (piece == 'b') { 
		board_context.drawImage(IMAGES.bBishop,x,y);
	} else if (piece == 'r') { 
		board_context.drawImage(IMAGES.bRook,x,y);
	} else if (piece == 'q') { 
		board_context.drawImage(IMAGES.bQueen,x,y);
	} else if (piece == 'k') { 
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

function tint_sq(x,y,color,global_alpha) {
	/*function responsible for tinting squares of color 'color'*/
	board_context.fillStyle = color;
	board_context.globalAlpha = global_alpha;
	if (selected_square != null) {
		if (!(selected_square.x == x && selected_square.y == y)) {
			board_context.fillRect(x*SQ_DIM,y*SQ_DIM,SQ_DIM,SQ_DIM);
		}
	} else {
		board_context.fillRect(x*SQ_DIM,y*SQ_DIM,SQ_DIM,SQ_DIM);
	}
}

function set_HTML_elements() {
	/*sets the HTML elements associated with the game data*/
	document.getElementById("fen").innerHTML = game.fen;
	if (calculate_material_balance(game.fen) > 0) {
		document.getElementById("material_balance").innerHTML = "material balance = +"+calculate_material_balance(game.fen);
	} else {
		document.getElementById("material_balance").innerHTML = "material balance = "+calculate_material_balance(game.fen);
	}
	var pgn_html = "";
	for (var i = 0; i < game.pgn.length; i++) {
		if (i%2 == 0) {
			pgn_html += "<tr><td style='width:30px;float:right;'>"+((i/2)+1)+"</td>";
		}
		pgn_html += "<td style='width:100px;'>"+game.pgn[i].notation+"</td>";
		if (i%2 == 1) {
			pgn_html += "</tr>";
		}
	}
	if (game.pgn.length == 0) {
		pgn_html = "<tr><td style='width:30px;float:right;'>1</td><td style='width:100px;'></td><td style='width:100px;'></td></tr>";
	}
	if (game.pgn.length == 1) {
		pgn_html += "<td style='width:100px;'></td>";
	}
	document.getElementById("pgn").innerHTML = pgn_html;
	if (game.result != null) {
		document.getElementById("game_result_E").innerHTML = ":        "+game.result.e;
		document.getElementById("game_result_E").style.opacity = 1.0;
	} else {
		document.getElementById("game_result_E").innerHTML = ":         null";
		document.getElementById("game_result_E").style.opacity = 0.0;
	}
}

window.addEventListener('load', setup, false);


</script>

<div id="game">
	
	<canvas id="board" width="640" height="640">canvas</canvas>
	<div id="game_result">
		<h2 id="game_result_E"></h2>
	</div>
	<div id="right_panel">
		<h3 id="opponent">opponent</h3>
		<div id="table">
			<div id="pgn_container">
				<table id="pgn"></table>
			</div>
			<div id="table_controls_div">
				<button class="table_controls" id="to_start"><<</button>
				<button class="table_controls" id="back"><</button>
				<button class="table_controls" id="forward">></button>
				<button class="table_controls" id="to_end">>></button>
			</div>
		</div>
		<h3 id="self">self</h3>
	</div>

</div>
<br><br>
<div class="game_data" style="width:300px;margin-top:630px;">
	<h3 id="material_balance">null</h3>
</div>
<br>
<div class="game_data">
	<h4 id="fen">fen placeholder</h4>
</div>

