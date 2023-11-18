import jwt from "jsonwebtoken"

export const tokenAuth = (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
        const token = bearerHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (error, authData) => {
            if (error) {
                console.error(error);
                return res.status(401).send({ error: "authorization invalid" });
            } else {
                req.user = authData;
                return next();
            }
        });
    } else {
        res.status(401).send({ error: "authorization not provided" });
    }
}

export const apiAuth = async (req, res, next) => {
    try {
        const apiKey = req.headers["x-api-key"];
        if (apiKey === process.env.API_KEY) {
            return next();
        } else {
            return res.status(403).send();
        }
    } catch (error) {
        return next(error);
    }
}