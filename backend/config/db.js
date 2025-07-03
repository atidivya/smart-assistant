import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGDB_URL)
        console.log("👉 Mongo DB connected....")
    } catch(error) {
        console.log(error)
    }
}