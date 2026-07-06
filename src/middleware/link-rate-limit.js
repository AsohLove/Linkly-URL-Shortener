import rateLimit from "express-rate-limit";


export const createLinkLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 20,

    legacyHeaders: false,

    standardHeaders: true,

    message: {
        success: false,
        message: "Too many links have been created. Wait and try again later..."
    }
})