const Router = require('express').Router;
const UserController = require('../controllers/user-controller');
const CassaController = require('../controllers/cassa-controller');
const UploadController = require('../controllers/upload-controller');
const GameController = require('../controllers/game-controller');
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
router.get('/forget', UserController.forget);

router.get('/users', authMiddleware, UserController.getUsers);
router.post('/users/:id/update', authMiddleware, UserController.updateUser);
router.post('/users/:id/change-password', authMiddleware, UserController.changePassword);
router.get('/users/:id/reset-password', authMiddleware, UserController.resetPassword);
router.get('/users/:id/set-pending-for-verification', authMiddleware, UserController.setPendingForVerification);
router.get('/users/:id/verification-images', authMiddleware, UserController.getVerificationImages);
router.get('/users/:id/verification/accept', authMiddleware, UserController.acceptUserVerification);
router.get('/users/:id/verification/reject', authMiddleware, UserController.rejectUserVerification);

router.get('/cassa/pulls', authMiddleware, CassaController.getPulls);
router.get('/cassa/pushs', authMiddleware, CassaController.getPushs);
router.get('/cassa/pushs/accept/:id', CassaController.acceptPush);
router.get('/cassa/pulls/accept/:id', authMiddleware, CassaController.acceptPull);
router.get('/cassa/pulls/reject/:id', authMiddleware, CassaController.rejectPull);
router.post('/cassa/pull', authMiddleware, CassaController.createPull);
router.post('/cassa/push',  CassaController.createPush);
router.get('/cassa/pay_history', authMiddleware, CassaController.getPayHistory);
router.get('/cassa/transactions', authMiddleware, CassaController.getTransactions);
router.get('/cassa/transactions/:id', authMiddleware, CassaController.getTransaction);
router.post('/cassa/transactions/:id/update', authMiddleware, CassaController.updateTransaction);
router.get('/cassa/fake/pushs', authMiddleware, CassaController.getAllFakePushs);

router.post('/cassa/cold/transactions', authMiddleware, CassaController.createColdTransaction);
router.get('/cassa/cold/transactions', authMiddleware, CassaController.getColdTransactions);

router.post('/cassa/crypto/transactions', authMiddleware, CassaController.createCryptoTransaction);
router.get('/cassa/crypto/transactions', authMiddleware, CassaController.getCryptoTransactions);
router.get('/cassa/crypto/transactions/accept/:id', authMiddleware, CassaController.acceptCryptoTransactions);
router.get('/cassa/crypto/transactions/reject/:id', authMiddleware, CassaController.rejectCryptoTransactions);

router.post('/upload', authMiddleware, UploadController.uploadFiles);

router.get('/games', GameController.getGames);
router.post('/game', GameController.createGame);
router.delete('/games/:slug', GameController.deleteGame);

router.get('/player/songs', UploadController.getSongs);
router.delete('/player/songs/:song', UploadController.deleteSong);

router.post('/pay-event', UserController.payEvent);
router.post('/get-checkout', UserController.getCheckout);

router.get('/get-crosspay-checkout', UserController.getCrosspayCheckout);

router.post('/trusty-callback', CassaController.trustyCallback);

router.post('/betterbro-payment', CassaController.betterBroPayment);
router.post('/securemasterpay-payment', CassaController.masterPayPayment);

module.exports = router;