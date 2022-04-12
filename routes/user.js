const express = require('express');
const userHandler = require('../controller/user');
const auth = require('../controller/auth');

const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.get('/myChats', auth.protect, userHandler.getMyChats);


router.route('/')
    .get(userHandler.getAllUsers)
    .post(userHandler.createUser);
router.route('/:id')
    .get(userHandler.getUser)
    .patch(userHandler.updateUser)
    .delete(userHandler.deleteUser);
    
module.exports = router;