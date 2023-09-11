const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
  name :{
    type : String,
    required : true
  },
  email:{
    type : String,
    required : true
  },
  contact:{
    type : Number,
    required : true
  },
  DOB :{
    type : String,
    required : true
  },
  gender:{
    type : String,
    required : true
  },
  current_location :{
    type : String,
    required : true
  },
  password :{
    type : String,
    required : true
  },
  confirm_password :{
    type : String,
    required  : true
  },
  cv: {
    type: String,
    required  : false
  },
  image: {
    type: String,
    required  : false
    },
  skill:{
    type: [String],
    required: false
  },
  experience:{
    type: String,
    required:false
  },
});

const User = mongoose.model('USER',userSchema);


module.exports = User;