import { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImage from "../assets/AI.gif";
import userImage from "../assets/Voice.gif";
import { CgMenu } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";

function Home() {
  const { userData, serverUrl, setUserData, getAiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const [ham, setHam] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log(result);
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      } catch (error) {
        if (!error.message.includes("start")) {
          console.error("Recognition error: ", error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");

    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };

    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://google.com/search?q=${query}`, "_blank");
    }

    if (type === "calculator_open") {
      window.open(`https://google.com/search?q=calculator`, "_blank");
    }

    if (type === "instagram_open") {
      window.open(`https://www.instagram.com`, "_blank");
    }

    if (type === "facebook_open") {
      window.open(`https://www.facebook.com`, "_blank");
    }

    if (type === "weather_show") {
      window.open(`https://google.com/search?q="weather ${query}`, "_blank");
    }

    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.log("Start error:", error);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      console.log("Recognition started");
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log(error);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log(error);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard:", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);

        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getAiResponse(transcript);
        console.log(data);

        setTimeout(() => {
          handleCommand(data);

          setUserText("");
          setAiText(data.response);
        }, 300);
      }
    };

    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.name}, how can I help you?`
    );
    greeting.lang = "hi-IN";
    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#35354d] flex justify-center items-center flex-col gap-3.5 relative overflow-hidden">
      {!ham && (
        <CgMenu
          className="lg:hidden text-white absolute top-5 right-5 w-6 h-6 cursor-pointer z-50"
          onClick={() => setHam(true)}
        />
      )}

      {/* Sidebar (Mobile) */}
      <div
        className={`absolute top-0 right-0 h-full w-full bg-[#00000053] backdrop-blur-lg p-5 flex flex-col gap-5 transform transition-transform duration-300 z-40 ${
          ham ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
      >
        {ham && (
          <RxCross2
            className="text-white absolute top-5 right-5 w-6 h-6 cursor-pointer z-50"
            onClick={() => setHam(false)}
          />
        )}

        <button
          className="min-w-[150px] h-[60px] bg-amber-800 rounded-2xl text-white font-semibold text-xl mt-20"
          onClick={handleLogout}
        >
          Logout
        </button>

        <button
          className="min-w-[250px] h-[60px] bg-amber-800 rounded-2xl text-white font-semibold text-xl px-[20px] py-[10px]"
          onClick={() => navigate("/customize")}
        >
          Customize your assistant
        </button>

        <div className="w-full h-[2px] bg-gray-400" />

        <h1 className="text-white font-semibold text-[19px]">History</h1>

        <div className="w-full h-[400px] overflow-y-auto flex flex-col">
          {userData?.history?.map((history, i) => (
            <span key={i} className="text-gray-400 text-[22px]">
              {history}
            </span>
          ))}
        </div>
      </div>

      {/* Desktop Buttons */}
      <button
        className="hidden lg:block min-w-[150px] h-[60px] bg-amber-800 rounded-2xl text-white font-semibold text-xl m-5 absolute top-5 right-5"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        className="hidden lg:block min-w-[250px] h-[60px] bg-amber-800 rounded-2xl text-white font-semibold text-xl m-5 absolute top-[100px] right-5 px-[20px] py-[10px]"
        onClick={() => navigate("/customize")}
      >
        Customize your assistant
      </button>

      {/* Assistant Image */}
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-md shadow-amber-300">
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="h-full object-cover"
        />
      </div>

      <h1 className="text-white text-[15px]">
        If you face issues on Chrome, please use Edge or another browser.
      </h1>
      <h1 className="text-white text-[18px] font-semibold">
        I am {userData?.assistantName}
      </h1>

      {!aiText && <img src={userImage} alt="User" className="w-[200px]" />}
      {aiText && <img src={aiImage} alt="AI" className="w-[200px]" />}

      <h1 className="text-white text-[18px] font-semibold text-wrap text-center px-4">
        {userText || aiText || ""}
      </h1>
    </div>
  );
}

export default Home;
