import { Router } from "express";
import bcrypt from 'bcrypt';
import createError from "http-errors";

// import { success } from "zod";


import { validate } from "../middleware/validate-middleware.js";

import * as links from "../models/links-model.js";
import * as users from "../models/users-model.js"

import { codeLinkSchema, createShortLinkSchema, querySchema } from "../validation/link-validation.js";

import { generateLinkCode } from "../lib/generateLinkCode.js";
import { userAuthenticationSchema } from "../validation/auth-validation.js";


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

router.delete('/:code', validate(codeLinkSchema, 'params'), async (req, res, next) => {
    try {
        
        const deleted = await links.remove(req.params.code);

        if (!deleted) {
            throw createError(404, 'The link you entered is not found!!');
        }

        res.sendStatus(204);

    } catch (err) {
        next(err);
    }
});


router.get('/:code/clicks', 
        validate(codeLinkSchema, "params"), validate(querySchema, "query"),
        async (req, res, next) => {
            try {
                
                const { code } = req.params;

                const { after, limit } =  req.validateQuery;

                const clicks = await links.getLinkClicks(code, after, limit);

                res.json({
                    success: true,
                    data: clicks,
                    nextCursor: 
                        clicks.length ? clicks.at(-1).id : null
                });

            } catch (err) {
                next(err);
            }
        })

router.get('/:code/clicks.csv', validate(codeLinkSchema, "params"), async (req, res, next) => {
    try {
       
        const rows = await links.getLinkClicks(req.params.code, 0, 100000);

        res.setHeader("Content-Type", "text/csv");

        res.setHeader("Content-Disposition", "attachment; filename=clicks.csv");

        res.write("clicked_at,referrer,user_agent\n");

        for (const row of rows){
            res.write(`${row.clicked_at},${row.referrer ?? ""},${row.user_agent ?? ""}\n`);
        }

        res.end();

    } catch (err) {
        next(err);
    }
})



export default router;