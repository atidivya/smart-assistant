import jwt from "jsonwebtoken";

const generateToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    console.log("🧠 Token generated:", token);

    return token;
  } catch (error) {
    console.log(error);
  }
};

export default generateToken
