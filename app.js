const path = require('path');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/appError');
const errorHandler = require('./utils/errorHandler');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const viewRouter = require('./routes/view');
const messageRouter = require('./routes/message');

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());


app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/messages', messageRouter);

app.all('*', (req, res, next) => {
    const err = new AppError('URL not found', 404);
    next(err);
});
app.use(errorHandler);


module.exports = app;