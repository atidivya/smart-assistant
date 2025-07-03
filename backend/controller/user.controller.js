import User from "../modals/user.modal.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import aiResponse from "../middlewares/gemini.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    console.log("💥================User Controller logs================💥");
    console.log("🔍 Cookies received:", req.cookies);
    console.log("✅ User ID from token:", req.userId);

    if (!req.userId)
      return res.status(401).json({ message: "User not authenticated" });

    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(400).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "getCurrentUser: User Controller error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    console.log(
      "🚨================Update assistant controller logs================🚨"
    );
    console.log("🛠️🚀  Request body", req.body);

    const { assistantName, imageUrl } = req.body;
    let aiImage;

    if (req.file) {
      aiImage = await uploadOnCloudinary(req.file.path);
    } else {
      aiImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName: assistantName,
        assistantImage: aiImage,
      },
      {
        new: true,
      }
    ).select("-password");

    console.log("✅ Assistant update successfull:", user);

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "updateAssistant: updating assistant error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    const user = await User.findById(req.userId);

    if (!user)
      return res
        .status(401)
        .json({ message: "🧐 askToAssistant: User not found" });

    const userName = user.name;
    const assistantName = user.assistantName;

    user.history.push(command);
    user.save();

    const result = await aiResponse(command, assistantName, userName);

    const jsonMatch = result.match(/{[\s\S]*}/);

    if (!jsonMatch)
      return res.status(400).json({
        response: "🔍 askToAssistant: Could not validate the requested search",
      });

    const aiResult = JSON.parse(jsonMatch[0]);

    const type = aiResult.type;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: aiResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get_time":
        return res.json({
          type,
          userInput: aiResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });
      case "get_day":
        return res.json({
          type,
          userInput: aiResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userInput: aiResult.userInput,
          response: `Today's month is ${moment().format("MMMM")}`,
        });
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput: aiResult.userInput,
          response: aiResult.response,
        });
      default:
        return res.status(400).json({
          response: "⏳ I did not understand the command",
        });
    }
  } catch (error) {
    console.log("askToAssistant: 🚨 Ask assistant general error");

    return res.status(500).json({
      response: "askToAssistant: 🚨 Ask assistant general error",
    });
  }
};
