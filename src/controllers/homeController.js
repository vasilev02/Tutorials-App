const router = require('express').Router();
const courseService = require('../services/courseService');

const getHomePage = async (req, res) => {
  const authState = req.user ? 'user' : 'guest';

  if (authState == 'user') {
    const courses = await courseService.getAll();
    res.render('home/user-home', { courses });
  } else {
    const allCourses = await courseService.getAll()
    const courses = allCourses
      .sort((a, b) => b.usersEnrolled.length - a.usersEnrolled.length)
      .slice(0, 2);
      
    res.render('home/guest-home', { courses });
  }

}

const search = async (req, res) => {
  const courses = await courseService.search(req.query);
  console.log(courses)

  res.render('home/user-home', { courses });
}

// const getAboutPage = (req, res) => {
//   res.render('about');
// }

router.get('/', getHomePage);
router.get('/search', search);

// router.get('/about', getAboutPage);

module.exports = router;