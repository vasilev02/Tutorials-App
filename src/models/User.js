const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    validate: /\w+/
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    validate: /\w+/
  },
  enrolledCourses: [{
    type: mongoose.Types.ObjectId,
    ref: 'Course'
  }]
});

userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      next();
    });
});

userSchema.method('validatePassword', function (password) {
  return bcrypt.compare(password, this.password);
});

const User = mongoose.model('User', userSchema);
module.exports = User;