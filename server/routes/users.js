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
        db.users.find({ email: req.body.email })
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        };
        // store into database
        res.status(201).send();
    } catch (error) {
        res.status(500).send();
    }
})