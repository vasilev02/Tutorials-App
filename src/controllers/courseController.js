const router = require('express').Router();
const courseService = require('../services/courseService.js');

const getCreatePage = (req, res) => {
  res.render('course/create');
}

const createCourse = async (req, res) => {
  const course = req.body;
  const userId = req.user._id;

  try {
    await courseService.create(course, userId);
    res.redirect('/');
  } catch (error) {
    res.render('course/create', { error: handleError(error) });
  }
}

const getDetailsPage = async (req, res) => {
  const courseId = req.params.courseId;
  const course = await courseService.getOne(courseId);

  const userId = req.user ? req.user._id : undefined;

  const isOwner = userId ? course.owner == userId : false;

  const isEnrolled = userId ? course.usersEnrolled.some(user => user == userId) : false;
  // const users = await courseService.getBuddies(course.users);

  res.render('course/details', { ...course, isOwner, isEnrolled });
}

const getEditPage = async (req, res) => {
  const courseId = req.params.courseId;
  const course = await courseService.getOne(courseId);

  res.render('course/edit', { ...course });
}

const editCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const course = req.body;

  try {
    await courseService.updateOne(courseId, course);
    res.redirect(`/course/${courseId}/details`);
  } catch (error) {
    res.render('course/edit', { error: handleError(error) });
  }
}

const deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    await courseService.deleteOne(courseId);
    res.redirect('/');
  } catch (error) {
    res.render('course/details', { error: handleError(error) });
  }
}

const enroll = async (req, res) => {
  const courseId = req.params.courseId;
  const course = await courseService.getOne(courseId);
  const userId = req.user._id;

  try {
    await courseService.enrollUser(courseId, course, userId);
    res.redirect(`/course/${courseId}/details`);
  } catch (error) {
    res.render('course/details', { error: handleError(error) });
  }
}




const handleError = error => {
  const errors = Object.keys(error.errors);

  if (errors.length > 0) {
    const firstError = errors[0];
    return error.errors[firstError];
  } else {
    return error.errors;
  }
}

router.get('/create', getCreatePage);
router.post('/create', createCourse);

router.get('/:courseId/details', getDetailsPage);
router.get('/:courseId/edit', getEditPage);
router.post('/:courseId/edit', editCourse);
router.get('/:courseId/delete', deleteCourse);

router.get('/:courseId/enroll', enroll);


module.exports = router;