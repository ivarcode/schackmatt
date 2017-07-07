const express = require('express');
const router = express.Router();

// bring in user model
let Game = require('../models/game');


// create_game route
router.get('/create', function(req, res) {
  res.render('create_game', {
    title:'create game'
  });
});

// create_game submit POST route
router.post('/create', function(req, res) {
  let game = new Game();
  game.white = req.body.white;
  game.black = req.body.black;
  game.pgn = req.body.pgn;
  game.result = req.body.result;

  game.save(function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});


module.exports = router;
