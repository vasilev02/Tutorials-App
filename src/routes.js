const express = require('express');
const router = express.Router();

const homeController = require('./controllers/homeController');
const courseController = require('./controllers/courseController');
const authController = require('./controllers/authController');

router.use(homeController);
router.use('/course', courseController);
router.use('/auth', authController);
// router.get('*', (req, res) => {
//   res.render('404');
// });

module.exports = router;