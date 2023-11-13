require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // For parsing application/json
const PORT = 8080;

mongoose.connect(process.env.DATABASE_URL);
db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("connected to database"));

const usersRouter = require('./routes/users');
app.use('/user', usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
