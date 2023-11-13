const express = require('express');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');

module.exports = router;

router.get('/', async (req, res) => { // to be deleted
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
    
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/register',  async (req, res) => {
    try {
       foundUser = await User.find({$or: [
            {userName: req.body.userName},
            {email: req.body.email}
        ]});
        if (foundUser.length) { // verify for conflicts
            console.log(foundUser);
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
        res.status(500).send();
    }
})