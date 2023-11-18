import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { tokenAuth, apiAuth } from "../middleware/auth.js";

const router = express.Router()
export default router;

router.get('/all', async (req, res) => { // to be deleted
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send();
        console.error(error);
    }
})

router.post('/login', async (req, res) => {
  try {
    // validates user existance
    const user = await User.findOne({
        $or: [{userName: req.body.userName}, {email: req.body.email}]
    });
    if (!user) return res.status(400).send(
        { error: "user does not exist" }
    );
    // try login
    if (await bcrypt.compare(req.body.password, user.password)) {
        res.status(200).send({
            token: generateToken(user),
        });
    } else {
        res.status(401).send();
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post('/register',  async (req, res) => {
    try {
        const foundUser = await User.find({$or: [
            {userName: req.body.userName},
            {email: req.body.email}
        ]});
        if (foundUser.length) { // handle conflicts
            return res.status(409).send();
        }
        // create user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword,
        };
        User.create(user);
        
        res.status(201).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
})


// read this user
router.get('/', tokenAuth, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user._id}).select("-password");
        if (user) {
            return res.status(200).send(user);
        } else {
            res.sendStatus(410);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

// delete this user
router.delete('/', tokenAuth, async (req, res) => {
    try {
        await User.findOneAndDelete({_id: req.user._id});
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})
