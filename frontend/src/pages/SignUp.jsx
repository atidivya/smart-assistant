import { useContext, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState();
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      setLoading(false);
      setUserData(result.data)
      navigate("/customize")
    } catch (error) {
      console.log(error);
      setUserData(null)
      setLoading(true);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="w-full h-[100vh] bg-cover flex justify-center items-center">
        <form
          className="w-[90%] h-[600px] max-w-[500px] bg-[#000000ab] backdrop-blur shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-[20px] px-[20px]"
          onSubmit={handleSignUp}
        >
          <h1 className="text-white text-[30px] font-semibold mb-[30px]">
            Sign up for your{" "}
            <span className="text-blue-200">Smart Assistant</span>
          </h1>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full h-[60px] outline-none border-2 border-white bg-amber-50 bg-transparent-text-black placehorder-gray-300 rounded-full px-[20px] py-[10px] text-[18px]"
            onChange={(event) => setName(event.target.value)}
            value={name}
            required
          />
          <input
            type="text"
            placeholder="Email"
            className="w-full h-[60px] outline-none border-2 border-white bg-amber-50 bg-transparent-text-black placehorder-gray-300 rounded-full px-[20px] py-[10px] text-[18px]"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            required
          />
          <div className="relative w-full h-[60px] border-2 border-white bg-amber-50 bg-transparent-text-black rounded-full text-[18px]">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-full rounded-full outline-none bg-transparent placehorder-gray-300 px-[20px] py-[10px]"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              required
            />
            {!showPassword && (
              <IoEye
                className="absolute top-[17px] right-[20px] text-black w-[25px] h-[25px] cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
            {showPassword && (
              <IoEyeOff
                className="absolute top-[17px] right-[20px] text-black w-[25px] h-[25px] cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            )}
          </div>
          {error.length > 0 && <p className="text-red-300 text-md">*{error}</p>}
          <button
            className="min-w-[150px] h-[60px] bg-amber-800 rounded-2xl text-white font-semibold text-xl m-5 cursor-pointer"
            disabled={loading}
          >
          {loading ? "Signing up..." : "Sign Up"}
          </button>
          <p className="text-white text-lg">
            Already have your smart assistant?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
