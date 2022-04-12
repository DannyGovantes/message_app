const catchAsync = require('../utils/catchAsync');
const Chat = require('./../model/chat');
const User = require('./../model/user');
const factory = require('./factoryHandler');

exports.getAllChats = catchAsync(async (req, res, next) => {
    const chats = await Chat.find();
    res.status(201).json({
        status: 'success',
        data: {
            chats
        }
    });
});

exports.createChat = catchAsync(async (req, res, next) => {
    const participants = req.body.participants;
    const chat = await Chat.create(req.body);
    const promiseUsers = participants.map(async userId => User.findByIdAndUpdate(userId, { $push: { chats: chat._id } }, { new: true }));
    const users = await Promise.all(promiseUsers);
    res.status(201).json({
        status: 'success',
        data: {
            chat,
            users
        }
    });
    
});

exports.getUserChats = catchAsync(async (req, res, next) => {
    const chats = await Chat.find({ users: { _id: req.params.userId } });
    res.status(201).json({
        status: 'success',
        data:{
            chats
        }
    })
})
exports.deleteChat = factory.delete(Chat);

