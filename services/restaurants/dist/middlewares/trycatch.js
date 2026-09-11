const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    };
};
export default TryCatch;
