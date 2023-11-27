import mongoose from "mongoose";
import Item from "./item.js";

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
        select: false
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

userSchema.pre('deleteOne', async function (next) {
    try {
        const userid = this.getQuery()["_id"];
        await Item.deleteMany({postedBy: userid});
        next();
    } catch (error) {
        next(error);
    }

})

export default mongoose.model('User', userSchema);