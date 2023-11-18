import express from "express";
import Item from "../models/item.js";
import { tokenAuth } from "../middleware/auth.js";

const router = express.Router();
export default router;

router.get('/', async (req, res) => {
    try {
        const skip = (req.params.start) ? req.params.start - 1 : 0;
        const range = req.params.range;
        const totalAmount = await Item.countDocuments({});
        const items = await Item.find({}).skip(skip).limit(range);
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

router.post('/', (req, res) => {

})
