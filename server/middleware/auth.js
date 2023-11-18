import jwt from "jsonwebtoken"

export default (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
        const token = bearerHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (error, authData) => {
            if (error) {
                console.error(error);
                res.status(401).send({ error: "authorization invalid" });
            } else {
                req.user = authData;
                next();
            }
        });
    } else {
        res.status(401).send({ error: "authorization not provided" });
    }
}
