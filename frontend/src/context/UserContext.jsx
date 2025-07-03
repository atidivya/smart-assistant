import { createContext, useEffect, useState } from "react";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const [serverImage, setServerImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });

      setUserData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        {
          command,
        },
        { withCredentials: true }
      );

      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    serverImage,
    setServerImage,
    localImage,
    setLocalImage,
    selectedImage,
    setSelectedImage,
    getAiResponse,
  };

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;
