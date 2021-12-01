const Router = require('express').Router;
const UserController = require('../controllers/user-controller');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

const router = new Router();

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}),
    body('username').isLength({min: 4, max: 32}),
    UserController.register);
router.post('/login', UserController.login);
router.post('/logout', authMiddleware, UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);
router.get('/users', authMiddleware, UserController.getUsers);
router.post('/users/:id/update', authMiddleware, UserController.updateUser);

module.exports = router;