const express = require("express");
const cookieParser = require("cookie-parser");

// import cors from 'cors'

// app.use(cors({
//   origin: 'http://localhost:5173',  // ← your React dev server
//   credentials: true,                // ← REQUIRED for cookies
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }))

const authRouter = require("../routes/auth.routes");
const postRouter = require("../routes/post.routes");
const userRouter = require("../routes/user.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users",userRouter)

module.exports = app;