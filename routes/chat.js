const express = require('express');
const chatHandler = require('./../controller/chat')
const router = express.Router();

router.route('/')
    .get(chatHandler.getAllChats)
    .post(chatHandler.createChat);

router.route('/:userId')
    .get(chatHandler.getUserChats);

module.exports = router;