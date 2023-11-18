import jwt from "jsonwebtoken";

export default function generateToken(user) {
    return jwt.sign(
        {
            _id: user._id,
            userName: user.userName,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '10d'
        }
    )
}
