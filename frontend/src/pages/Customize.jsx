import { useRef, useContext } from "react";
import Card from "../components/Card";
import aiImage1 from "../assets/ai-image-1.jpg";
import aiImage2 from "../assets/ai-image-2.jpg";
import aiImage3 from "../assets/ai-image-3.jpg";
import aiImage5 from "../assets/ai-image-5.jpg";
import aiImage6 from "../assets/ai-image-6.jpg";
import aiImage7 from "../assets/ai-image-7.jpg";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
  const {
    setServerImage,
    localImage,
    setLocalImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const navigate = useNavigate();

  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setServerImage(file);
    setLocalImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#35354d] flex justify-center items-center flex-col">
      <MdKeyboardBackspace
        className="absolute top-[30px] left-[30px] w-[25px] h-[25px] text-white cursor-pointer"
        onClick={() => navigate("/")}
      />
      <h1 className="text-white text-[30px] text-center p-5">
        Choose your assistant <span className="text-amber-300">avatar</span>
      </h1>
      <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-4">
        <Card image={aiImage1} />
        <Card image={aiImage2} />
        <Card image={aiImage3} />
        <Card image={aiImage5} />
        <Card image={aiImage6} />
        <Card image={aiImage7} />
        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-blue-950 border-2  rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-amber-300 cursor-pointer hover:border-4 hover:border-amber-300 flex items-center justify-center ${
            selectedImage == "input"
              ? "border-4 border-amber-300 shadow-2xl shadow-amber-300"
              : "border-blue-200"
          }`}
          onClick={() => {
            inputImage.current.click(), setSelectedImage("input");
          }}
        >
          {!localImage && (
            <RiImageAddLine className="text-white w-[35px] h-[35px]" />
          )}
          {localImage && (
            <img src={localImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          onChange={handleImage}
          hidden
        />
      </div>
      {selectedImage && (
        <button
          className="min-w-[150px] h-[60px] bg-amber-800 rounded-2xl text-white font-semibold text-xl m-5 cursor-pointer"
          onClick={() => navigate("/customize-name")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;
