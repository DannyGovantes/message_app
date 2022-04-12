const Message = require('../model/message');
const User = require('./../model/user');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./factoryHandler');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(201).json({
        status: 'success',
        data: {
            users
        }
    })
})
exports.createUser = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.name,
    });
    res.status(201).json({
        status: 'Success',
        data: {
            user
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(201).json({
        status: 'Success',
        data: {
            user
        }
    });
})

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json({
        status: 'Success',
        data: {
            user
        }
    });
})
exports.getMyChats = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('chats');
    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    })
    
});

exports.deleteUser = factory.delete(User);