import { Router } from "express";
import createError from "http-errors";

import { success } from "zod";

import { validate } from "../middleware/validate-middleware.js";

import * as links from "../models/links-model.js";

import { codeLinkSchema, createShortLinkSchema } from "../validation/link-validation.js";

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

router.get('/:code', validate(codeLinkSchema, "params"), async (req, res, next) => {
    try {
        
        const { code } = req.params;

        const link = await links.getMetadata(code);

        if (!link) {
            throw createError(404, "The link you entered is not found!!");
        }

        res.json({
            success: true,
            data: link
        })

    } catch (err) {
        next(err);
    }   
});


export default router;