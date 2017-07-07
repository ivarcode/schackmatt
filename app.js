// Camden Wagner
// server.js

console.log('Starting server...');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database,{
  // new default connection logic - deprecated as of 4.11.0
  useMongoClient:true
});
let db = mongoose.connection;

// check connection
db.once('open', function() {
  console.log('Connected to MongoDB');
});
// check for db errors
db.on('error', function(err) {
  console.log(err);
});

// init server
const app = express();

// bring in models
let Game = require('./models/game');

// load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
// parse application/json
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname,'public')));

// express session middleware
app.use(session({
  secret: 'f4 e5 Kf2',
  resave: true,
  saveUninitialized: true
}));

// express messages middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;
    while (namespace.length) {
      formParam += '['+namespace.shift()+']';
    }
    return {
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

// passport config
require('./config/passport')(passport);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// home route
app.get('/', function(req, res) {
  Game.find({}, function(err, games) {
    if (err) {
      console.log(err);
    } else {
      // console.log(games);
      res.render('index', {
        title:'games',
        games:games
      });
    }
  });
});


// route files
let games = require('./routes/games');
let users = require('./routes/users');
app.use('/games',games);
app.use('/users',users);

// start server
app.listen(3000, function() {
  console.log('Server started on port 3000');
});
