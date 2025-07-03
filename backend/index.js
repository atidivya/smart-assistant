import express from "express"
import  dontenv  from "dotenv"
import { connectDb } from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"

dontenv.config()

const app = express()

app.use(cors({
    origin: "https://smart-assistant-3tjm.onrender.com",
    credentials: true
}))

const port = process.env.PORT || 8080

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.listen(port, () => {
    connectDb()
    console.log(`💡Server running on port ${port}`)
})
