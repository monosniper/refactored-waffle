const Router = require('express').Router;
const UserController = require('../controllers/user-controller');
const CassaController = require('../controllers/cassa-controller');
const UploadController = require('../controllers/upload-controller');
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
router.post('/users/:id/change-password', authMiddleware, UserController.changePassword);
router.get('/users/:id/set-pending-for-verification', authMiddleware, UserController.setPendingForVerification);
router.get('/users/:id/verification-images', authMiddleware, UserController.getVerificationImages);
router.get('/users/:id/verification/accept', authMiddleware, UserController.acceptUserVerification);
router.get('/users/:id/verification/reject', authMiddleware, UserController.rejectUserVerification);

router.get('/cassa/pulls', authMiddleware, CassaController.getPulls);
router.post('/cassa/pull', authMiddleware, CassaController.createPull);
router.get('/cassa/transactions', authMiddleware, CassaController.getTransactions);
router.get('/cassa/transactions/:id', authMiddleware, CassaController.getTransaction);
router.post('/cassa/transactions/:id/update', authMiddleware, CassaController.updateTransaction);

router.post('/upload', authMiddleware, UploadController.uploadFiles);

router.get('/player/songs', authMiddleware, UploadController.getSongs);
router.delete('/player/songs/:song', authMiddleware, UploadController.deleteSong);

router.post('/pay-event', UserController.payEvent);

module.exports = router;