const express = require('express');
const View = require('./../controller/view');
const auth = require('../controller/auth');
const router = express.Router();

router.use(auth.isLoggedIn);

router.get('/',View.getHome);
router.get('/login', View.getLogin);
router.get('/signin', View.getSignin);
router.get('/logout', auth.logout);
router.get('/chats', auth.protect, View.getChats);
router.get('/chats/:chatId', auth.protect, View.getMessages);    
router.post('/chats/:chatId', auth.protect, View.createMessage);    
router.get('/user/:id', View.getUser);
router.post('/user/:id', auth.protect, View.createChat);

module.exports = router;