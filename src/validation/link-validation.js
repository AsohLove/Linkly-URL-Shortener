import { z } from 'zod';

export const createShortLinkSchema = z.object({
    target_url: z
        .string()
        .url("Your target URL must be a valid URL")
        .refine(
            url => url.startsWith("http://") || url.startsWith("https://"), 
            {
                message: "YouR URL must start with http:// or https://"
            }
        ),

    code: z
        .string('Link code must be a string')
        .regex(/^[A-Za-z0-9_-]{3,16}$/)
        .optional(),

    expires_at: z
        .string()
        .datetime()
        .optional()

})

export const codeLinkSchema = z.object({
    code: z
        .string()
        .regex( /^[A-Za-z0-9_-]{3,16}$/, "You have entered invalid short code" )
});


export const querySchema = z.object({
    after: z
        .coerce
        .number()
        .int()
        .min(0)
        .default(0),
    
    limit: z
        .coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10)
})