import express from "express"
import  dontenv  from "dotenv"
import { connectDb } from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"

dontenv.config()

const app = express()

const allowedOrigins = [
  "https://smart-assistant-3tjm.onrender.com",
  "https://atidivya.github.io/smart-assistant/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

const port = process.env.PORT || 8080

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.listen(port, () => {
    connectDb()
    console.log(`💡Server running on port ${port}`)
})
