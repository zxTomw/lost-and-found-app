import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users.js";
import { apiAuth } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(express.json(), apiAuth); // For parsing application/json
const PORT = 8080;

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("connected to database"));

app.use('/user', usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
