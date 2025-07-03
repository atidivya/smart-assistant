import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { userDataContext } from "./context/UserContext";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/Customize";
import Home from "./pages/Home";
import CustomizeName from "./pages/CustomizeName";

function App() {
  const { userData } = useContext(userDataContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData.assistantName ? (
         <Home />
          ) : (
            <Navigate to={"/customize"} />
          )
        }
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/customize-name"
        element={userData ? <CustomizeName /> : <Navigate to={"/signup"} />}
      />
    </Routes>
  );
}

export default App;
