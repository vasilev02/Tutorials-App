const User = require('../models/User');
const Course = require('../models/Course');
const jwt = require('../utils/jwt');
const { SECRET } = require('../config/config')

const register = async userData => {
  let user = new User({
    username: userData.username,
    password: userData.password,
    enrolledCourses: []
  });

  return user.save();
}
const login = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('Invalid username or password');
  }

  const passwordMatch = await user.validatePassword(password);

  if (!passwordMatch) {
    throw new Error('Invalid password!')
  }

  const payload = { _id: user._id, username: user.username }
  const token = jwt.sign(payload, SECRET);

  return token;
}

const getOne = (id) => User.findById(id).lean();

const updateOne = (userId, user) => User.findByIdAndUpdate(userId, user, { runValidators: true });

const getCourses = async (userId) => {
  const user = await getOne(userId);
  const courseIds = user.tripsHistory;
  const courses = await Course.find({ '_id': { $in: courseIds } }).lean();

  return courses;
}

module.exports = { register, login, getOne, updateOne };