import { Router } from "express";
import createError from "http-errors";

import * as links from "../models/links-model.js";

import { validate } from "../middleware/validate-middleware.js";

import { createShortLinkSchema } from "../validation/link-validation.js";

import { generateLinkCode } from "../lib/generateLinkCode.js";

const router = Router();

router.post(
    "/",
    validate(createShortLinkSchema),
    async (req, res, next) => {
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

router.get('/:code', async (req, res, next) => {
    try {
        
        const link = await links.findLinkByCode(req.params.code);

        if (!link) {
            throw createError(404, 'The link you entered is not found!!');
        }

        if (link.expires_at && new Date(link.expires_at) < new Date()) {
            throw createError(410, 'The link is gone(expired)');
        }

        await links.clickCount(link.id, req.get("referrer") ?? null, req.get("user-agent") ?? null);

        // Using the Express built-in res.redirect function to declare a temporary redirect with status code 302
        res.redirect(302, link.target_url);


    } catch (err) {
        next(err);
    }
});



export default router;