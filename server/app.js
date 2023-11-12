const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;

app.use(express.json()); // For parsing application/json

app.post('/user/register', async (req, res) => {
    try {
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
});


app.post('/user/login', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
  } catch (error) {
    res.status(500).send();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
