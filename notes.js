universal chat log created when game is started with a new opponent
	messages sent during games have a game id value which allows us to find the p2p in game chat, keeping spectator chat separate

tournament style ideas?
	draw 1
	win 2
	each consecutive game after a win increases your streak, and number of wins - 3 is what is added to the 2 for each win?






CREATE TABLE `chess`.`user` ( `id` INT(11) NOT NULL AUTO_INCREMENT ,  `email` VARCHAR(255) NULL DEFAULT NULL ,  `username` VARCHAR(255) NULL DEFAULT NULL ,  `name` VARCHAR(255) NULL DEFAULT NULL ,  `password` VARCHAR(255) NULL DEFAULT NULL ,  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,    PRIMARY KEY  (`id`)) ENGINE = InnoDB;


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
			// console.log(legal_moves[n]);
			// console.log(move_data);
			if (orientation == 'black') {
				if (move_data.src.x == legal_moves[n].src.rank && move_data.src.y == legal_moves[n].src.file && 7-move_data.dest.x == legal_moves[n].dest.rank && 7-move_data.dest.y == legal_moves[n].dest.file) {
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
			} else {
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
		}
		// make move if it is legal and we are not promoting (waiting for a second click to determine what piece to promote)
		if (move_is_legal && !promoting) {
			print_move(legal_moves[move_index]);
			update_position(game,legal_moves[move_index]);
			set_HTML_elements();
			print_game_info(game);
			draw_board();//excessive redraw??
		} else if (promoting) {
			if (false) {
				promoting_to.x = 7-promoting_to.x;
				promoting_to.y = 7-promoting_to.y;
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
				promoting_to.x = 7-promoting_to.x;
				promoting_to.y = 7-promoting_to.y;
			} else {
				if (orientation == 'black') {
					promoting_to.x = 7-promoting_to.x;
					promoting_to.y = 7-promoting_to.y;
				}
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
				if (orientation == 'black') {
					promoting_to.x = 7-promoting_to.x;
					promoting_to.y = 7-promoting_to.y;
				}
			}
			draw_board();//excessive redraw??
		}
		if (get_turn(game.fen) == "WHITE") {
			if (white_player == 'computer') {
				make_random_move(game);
			}
		} else if (get_turn(game.fen) == "BLACK") {
			if (black_player == 'computer') {
				make_random_move(game);
			}
		}
	}

	mousedown = false;
	draw_board();

});