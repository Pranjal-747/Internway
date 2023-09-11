const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  image: {
    data:Buffer,
    contentType: String,
    },
  cv: {
    data:Buffer,
    contentType: String,
  },
  skill:{
    type: String,
    required: false
  },
  experience:{
    type: String,
    required:false
  },
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
