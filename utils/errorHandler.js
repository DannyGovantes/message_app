const AppError = require('./appError');

const castError = err => {
    const message = `Invalid ${err.path} is ${err.value}`;
    return new AppError(message, 400);
}

const developmentError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}

const productionError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error('WARNING: ERROR. DETAILS:', err);
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong'
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'development') {
        developmentError(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = err;
        if(err.name === 'CastError') error = castError(error)
        productionError(error, res);
    }
}