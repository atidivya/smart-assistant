import  User  from "../modals/user.modal.js"
import bcrypt from "bcryptjs"
import generateToken from "../config/token.js"

export const signUp = async (req, res) => {
    try {
        const { name, email, password} = req.body

        const existingEmail = await User.findOne({email})

        if(existingEmail) return res.status(400).json({message: "Email already exists!"})
        if(password.length < 6) return  res.status(400).json({message: "Password must have atleast 6 characters!"})

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            password: hashedPassword,
            email
        })

        const token = await generateToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(201).json(user)


    } catch(error) {
 
        return res.status(500).json({message: `Sign up error ${error}`})
    }
}

export const login = async (req, res) => {
    try {
        const { email, password} = req.body

        const user = await User.findOne({email})

        if(!user) return res.status(400).json({message: "Email does not exists!"})
        
        const isValidPassword = await bcrypt.compare(password, user.password)

        if(!isValidPassword) return res.status(400).json({message: "Incorrect password!"})

        const token = await generateToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(200).json(user)


    } catch(error) {
 
        return res.status(500).json({message: `Login error ${error}`})
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")

        return res.status(200).json({message: "Logout sucessfully!"})
    } catch(error) {
        return res.status(500).json({message: `Logout error: ${error}`})
    }
}