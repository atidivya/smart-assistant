import { useContext } from "react";
import { userDataContext } from "../context/userContext";

function Card({ image }) {
  const { selectedImage, setSelectedImage, setServerImage, setLocalImage } =
    useContext(userDataContext);

  return (
    <div
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-blue-950 border-2 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-amber-300 cursor-pointer hover:border-4 hover:border-amber-300 ${
        selectedImage == image
          ? "border-4 border-amber-300 shadow-2xl shadow-amber-300"
          : "border-blue-200"
      }`}
      onClick={() => {
        setSelectedImage(image), setServerImage(null), setLocalImage(null);
      }}
    >
      <img src={image} className="h-full object-cover" />
    </div>
  );
}

export default Card;
