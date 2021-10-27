const Course = require('../models/Course');
const User = require('../models/User');

const getAll = () => Course.find({}).lean();
// const getTop3 = () => Course.find({}).sort({}).limit(3).lean();
const getOne = (id) => Course.findById(id).lean();

const create = (courseData, userId) => {
  let course = new Course({
    title: courseData.title,
    description: courseData.description,
    imageUrl: courseData.imageUrl,
    duration: courseData.duration,
    owner: userId,
    usersEnrolled: []
  });

  return course.save();
}

const updateOne = (courseId, course) => Course.findByIdAndUpdate(courseId, course, { runValidators: true });

const deleteOne = (courseId) => Course.findByIdAndDelete(courseId);

const enrollUser = (courseId, course, userId) => {
  course.usersEnrolled.push(userId);
  return Course.findByIdAndUpdate(courseId, course, { runValidators: true });
}

// const getUsers = async (userIds) => {
//   const users = await User.find({_id: { $in: userIds }});

//   return users
//     .map(user => user.email)
//     .join(', ');
// }

// const getOwner = async (ownerId) => {
//   const owner = await User.findById(ownerId)

//   return owner.email;
// }

const search = async (query) => {
  let courses = await getAll();

  if (query.search) {
    courses = courses.filter(course => course.title.toLowerCase().includes(query.search.toLowerCase()));
  }

  return courses;
};


const courseService = { getAll, getOne, create, updateOne, deleteOne, search, enrollUser };
module.exports = courseService;