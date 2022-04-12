const catchAsync = require('./../utils/catchAsync');
const User = require('./../model/user');
const Message = require('./../model/message');
const Chat = require('./../model/chat');

exports.getHome = (req, res) => {
    res.status(200).render('home');
}
exports.getLogin = (req, res) => {
    res.status(200).render('auth/login');
}
exports.getSignin = (req, res) => {
    res.status(200).render('auth/signin');
}
exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.render('user',{user});
})
exports.getChats = catchAsync(async (req, res, next) => {
    const users = await User.find({ role: 'doctor' });
    const user = await User.findById(req.user.id, { select: "chats" }).populate('chats');
    res.status(200).render('chats', { user,users });

});
exports.getMessages = catchAsync(async (req, res, next) => {
    const messages = await Message.find({ chat: req.params.chatId });
    const chat = req.params.chatId;
    res.status(201).render('messages', { messages, chat });
});
exports.createMessage = catchAsync(async (req, res, next) => {
    const message = await Message.create({
        body: req.body.body,
        chat: req.params.chatId,
        owner: req.user
    });

    const chat = await Chat.findByIdAndUpdate(req.params.chatId, { modifiedAt: Date.now() });
    res.redirect(`/chats/${req.params.chatId}`);
});
exports.createChat = catchAsync(async (req, res, next) => {
    const participants = [
        req.user.id,
        req.params.id
    ];
    const chat = await Chat.create({participants:participants});
    const promiseUsers = participants.map(async userId =>User.findByIdAndUpdate(userId, { $push: { chats: chat._id } }, { new: true }));
    const users = await Promise.all(promiseUsers);
    res.redirect(`/chats/${chat._id}`);
})