const express = require('express');
const messageHandler = require('./../controller/message');

const router = express.Router();

router.route('/')
    .post(messageHandler.createMessage);
router.route('/:chatId')
    .get(messageHandler.getChatMessages);
module.exports = router;