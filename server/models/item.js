import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    place: {
        name: String,
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            },
        }
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

itemSchema.index({ "place.location": '2dsphere' })

export default mongoose.model('Item', itemSchema);
