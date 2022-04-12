const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    })
}
const createToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV ==='production' ? true : false,
        httpOnly: true,
    };
    res.cookie('jwt', token, cookieOptions)
    user.password = undefined;
    res.redirect('/')
}
exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    createToken(user, 201, res);
    
});
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Please provide email and password'), 400);
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await (user.verifyPassword(password, user.password))) return next(new AppError('Email not found or Incorrect Password', 401));
    const token = signToken(user._id);
    createToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        token = req.headers.authorization.split(' ')[1];
    
    } else if (req.cookies.jwt) {
        
        token = req.cookies.jwt;
    
    }
    if (!token) return next(new AppError('You are not logged in', 401));

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('No user belongs to that token', 401));
    req.user = user;
    next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {

    res.locals.currentUser = null;
    if (req.cookies.jwt) {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return next();
        res.locals.currentUser = user; 
        return next();
    }
    next();

});
exports.logout = (req, res) => {
    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true
    });
    res.redirect('/');
}

exports.permisons = (...roles)=> {
    return catchAsync(async (req, res, next) => {
        if (!roles.includes(req.user.role)) return new AppError('You do not have permision to perform this action', 403);
        next();
    })
}
