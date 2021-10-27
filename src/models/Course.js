const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 4
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 50
  },
  imageUrl: {
    type: String,
    required: true,
    validate: /^https?/
  },
  duration: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  usersEnrolled: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;