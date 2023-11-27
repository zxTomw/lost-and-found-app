import express from "express";
import Item from "../models/item.js";
import User from "../models/user.js";
import { tokenAuth } from "../middleware/auth.js";

const router = express.Router();
export default router;

router.get('/', async (req, res) => {
    try {
        const skip = (req.params.start) ? req.params.start - 1 : 0;
        const totalAmount = await Item.countDocuments({});
        const range = (req.params.range) ? req.params.range : totalAmount;
        const items = await Item.find({}).populate('postedBy')
                            .skip(skip).limit(range);
        return res.status(200).send(
            {
                items: items,
                totalAmount: totalAmount
            }
        )
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
})

router.post('/', tokenAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(400).send({ error: "invalid user" });
        const item = {
            name: req.body.name,
            description: req.body.description,
            postedBy: req.user._id,
            place: req.body.place
        };
        const newItem = await Item.create(item);
        user.items.push(newItem._id);
        user.save();
        return res.status(200).send({ msg: "item created successfully" })
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
})

router.put('/:id', async (req, res) => {
    try {
        let item = await Item.findById(req.params.id);
        if (!item) return res.status(404).send({
            error: `Item ${req.params.id} does not exist`
        });
        if (req.body.name) item.name = req.body.name;
        if (req.body.description) item.description = req.body.description;
        if (req.body.postedBy) item.postedBy = req.body.postedBy;
        if (req.body.place) item.place = req.body.place;
        await item.save();
        return res.status(200).send(item);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).send({
            error: `item ${req.params.id} does not exist`,
        });
        if (item.postedBy) await User.updateOne({ _id: item.postedBy }, {
            $pullAll: {
                items: [{ _id: item._id }]
            }
        });
        return res.status(200).send({ msg: `item ${req.params.id} deleted successfully`});
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
})
