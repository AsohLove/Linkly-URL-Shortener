export function validate(schema, property = "body") {
    return (req, res, next) => {
        const result = schema.safeParse(req[property]);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: result.error.flatten()
            });
        }

        req[property] = result.data;

        next();
    };

}