import { useState, useContext } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function CustomizeName() {
  const navigate = useNavigate();

  const { userData, serverImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [aiName, setAiName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();

      formData.append("assistantName", aiName);

      if (serverImage) formData.append("assistantImage", serverImage);
      else formData.append("imageUrl", selectedImage);

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      setLoading(false);
      console.log(result.data);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#35354d] flex justify-center items-center flex-col relative">
      <MdKeyboardBackspace
        className="absolute top-[30px] left-[30px] w-[25px] h-[25px] text-white cursor-pointer"
        onClick={() => navigate("/customize")}
      />
      <h1 className="text-white text-[30px] text-center p-5">
        Name your personal <span className="text-amber-300">assistant</span>
      </h1>
      <input
        type="text"
        placeholder="Ex: Jarvis"
        className="w-full h-[60px] max-w-[600px] outline-none border-2 border-white bg-amber-50 bg-transparent-text-black placehorder-gray-300 rounded-full px-[20px] py-[10px] text-[18px]"
        value={aiName}
        onChange={(e) => setAiName(e.target.value)}
      />
      {aiName && (
        <button
          className="min-w-[150px] h-[60px] bg-amber-800 rounded-2xl text-white font-semibold text-xl m-5 cursor-pointer"
          disabled={loading}
          onClick={() => handleUpdateAssistant()}
        >
          {loading ? "Loading..." : "Create"}
        </button>
      )}
    </div>
  );
}

export default CustomizeName;
