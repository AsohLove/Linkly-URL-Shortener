import { Router } from "express";
import createError from "http-errors";


import { validate } from "../middleware/validate-middleware.js";

import { createShortLinkSchema } from "../validation/link-validation.js";

import { generateLinkCode } from "../lib/generateLinkCode.js";

const router = Router();

router.post( "/", validate(createShortLinkSchema), async (req, res, next) => {
        try {

            const input = req.body;

            if (!input.code) {
                input.code = generateLinkCode();
            }

            const created = await links.create(input);

            res.status(201).json({
                success: true,
                data: created
            });

        } catch (err) {

            if (err.code === "23505") {
                return next(
                    createError(
                        409,
                        "This short code already exists... Try another on"
                    )
                );
            }

            next(err);
        }
    }
);




export default router;