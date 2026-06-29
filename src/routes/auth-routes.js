import { Router } from "express";
import bcrypt from 'bcrypt';
import createError from "http-errors";

import { validate } from "../middleware/validate-middleware.js";

import * as users from "../models/users-model.js"

import { userAuthenticationSchema, userLoginSchema } from "../validation/auth-validation.js";
import { comparePassword } from "../lib/password.js";
import { createToken } from "../lib/jwt.js";

const router = Router();

router.post('/register', validate(userAuthenticationSchema), async (req, res, next) => {
    try {
        
        const hash = await bcrypt.hash(
            req.body.password,
            10
        );

        const user = await users.create(req.body.email, hash);

        res.status(201).json(user)

    } catch (err) {
        if (err.code==="23505") {
            return next(createError(409, 'Email already exists!!'));
        }
        next(err);

    }
});

router.post('/login', validate(userLoginSchema), async (req, res, next) => {
    try {
        
        const {email, password } = req.body;

        const user = await users.findUserByEmail(email);

        if (!user) {
            throw createError(401, 'Invalid email or password');
        }

        const valid = await comparePassword(password, user.password_hash);

        if (!valid) {
            throw createError(401, 'Invalid email or password');
        }

        const token = createToken(user);

        res.json({
            success: true,
            token
        });


    } catch (err) {
        next(err);
        
    }
})



export default router;