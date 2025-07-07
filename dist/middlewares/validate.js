export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            res.status(400).json({
                errors,
            });
            return;
        }
        req.body = result.data;
        next();
    };
}
