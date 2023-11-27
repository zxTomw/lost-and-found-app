import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { tokenAuth } from "../middleware/auth.js";

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
        $or: [{username: req.body.username}, {email: req.body.email}]
    }).select('+password');
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

router.post('/',  async (req, res) => {
    try {
        const foundUser = await User.find({$or: [
            {username: req.body.username},
            {email: req.body.email}
        ]});
        if (foundUser.length) { // handle conflicts
            return res.status(409).send();
        }
        // create user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            username: req.body.username,
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

// update user
router.put('/', tokenAuth, async (req, res) => {
    try {
        let user = await User.findById(req.user._id).select('+password');
        const newEmail = req.body.email;
        const newPassword = req.body.password;
        if (newEmail) {
            let findConflict = await User.findOne({
                $and: [
                    {'_id': {$ne: req.user._id}},
                    {'email': newEmail},
                ]
            })
            if (findConflict) return res.status(409).send(
                { error: "email unavailable" } 
            );
            user.email = newEmail;
        }
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
        };
        await user.save();
        return res.status(200).send(user);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
})

// read this user
router.get('/:id?', tokenAuth, async (req, res) => {
    try {
        const userid = req.params.id ? req.params.id : req.user._id;
        const user = await User.findById(userid).populate('items');
        if (user) {
            return res.status(200).send(user);
        } else {
            return res.status(400).send(`could not find user ${userid}`);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

// delete this user
router.delete('/', tokenAuth, async (req, res) => {
    try {
        await User.deleteOne({_id: req.user._id});
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})
