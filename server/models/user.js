import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        about: String,
        link: String
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export default mongoose.model('User', userSchema);