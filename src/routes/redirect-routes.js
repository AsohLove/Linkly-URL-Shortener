import { Router } from "express";
import createError from "http-errors";

import * as links from "../models/links-model.js";
import { validate } from "../middleware/validate-middleware.js";
import { codeLinkSchema } from "../validation/link-validation.js";

const router = Router();

router.get('/:code', validate(codeLinkSchema, "params"), async (req, res, next) => {
    try {

        const { code } = req.params;
        
        const link = await links.findLinkByCode(req.params.code);

        const isValidCode = /^[a-zA-Z0-9_-]{3,30}$/.test(code);

        if (!isValidCode) {
            return next(createError(404, "Route not found"));
        }

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