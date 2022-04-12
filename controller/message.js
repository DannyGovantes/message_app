const catchAsync = require('../utils/catchAsync');
const Message = require('./../model/message');
const factory = require('./factoryHandler');

exports.getChatMessages = catchAsync(async (req, res, next) => {
    const messages = await Message.find({ chat: req.params.chatId });
    res.status(201).json({
        status: 'success',
        data: {
            messages
        }
    })
})

exports.createMessage = factory.create(Message);
exports.deleteMessage = factory.delete(Message);