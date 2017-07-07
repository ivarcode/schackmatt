const mongoose = require('mongoose');

// user schema
const userSchema = mongoose.Schema({
  name:{
    type: String,
    required:true
  },
  email:{
    type: String,
    required:true
  },
  username:{
    type: String,
    required:true
  },
  password:{
    type: String,
    required:true
  }
});

const User = module.exports = mongoose.model('User',userSchema);
