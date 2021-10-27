const router = require('express').Router();
const authService = require('../services/authService');
const { TOKEN_COOKIE_NAME } = require('../constants');
const { isAuthenticated, isGuest } = require('../middlewares/authMiddleware');

const getRegisterPage = (req, res) => {
  res.render('auth/register');
}

const getLoginPage = (req, res) => {
  res.render('auth/login');
}

const register = async (req, res) => {
  try {
    const { username, password, rePassword } = req.body;

    if (password !== rePassword) {
      res.locals.error = 'Passwords should match!'
      return res.render('auth/register');
    }

    await authService.register({ username, password });
    const token = await authService.login(username, password);
    res.cookie(TOKEN_COOKIE_NAME, token);

    res.redirect('/');

  } catch (error) {
    res.render('auth/register', { error: handleError(error) });
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);

    res.cookie(TOKEN_COOKIE_NAME, token);
    res.redirect('/');
  } catch (error) {
    res.render('auth/login', { error: handleError(error) });
  }
}

const logout = (req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME);
  res.redirect('/');
}

// const getProfilePage = async (req, res) => {
//   const userId = req.user._id;
//   const user = await authService.getOne(userId);
//   const courses = await authService.getCourses(userId);

//   res.render('auth/profile', { ...user, courses });
// }

const handleError = error => {
  const errors = Object.keys(error.errors);

  if (errors.length > 0) {
    const firstError = errors[0];
    return error.errors[firstError];
  } else {
    return error.errors;
  }
}

router.get('/register', isGuest, getRegisterPage);
router.post('/register', isGuest, register);
router.get('/login', isGuest, getLoginPage);
router.post('/login', isGuest, login);
router.get('/logout', isAuthenticated, logout);
// router.get('/:userId', getProfilePage);

module.exports = router;