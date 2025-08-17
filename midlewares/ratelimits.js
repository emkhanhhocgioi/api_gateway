const rateLimit = require('express-rate-limit');



const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: {
        status: 429,
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: true, 
    legacyHeaders: false, 
    skipSuccessfulRequests: true 
});

module.exports = limiter;