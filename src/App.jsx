import { useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const [recording, setRecording] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [answerMode, setAnswerMode] = useState("text");
  const [transcription, setTranscription] = useState("");
  const [audioURL, setAudioURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef();

  var SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();

  const msg = new SpeechSynthesisUtterance();

  const getMessage = async () => {
    setLoading(true);
    const apiUrl =
      "https://run.mocky.io/v3/0e943298-786d-462b-ac7b-74b6127212e6";
    await fetch(apiUrl)
      .then((response) => response.text())
      .then((text) => eval(`(${text})`))
      .then((res) => {
        setMessage(res);
        if (answerMode === "audio") {
          msg.text = res.message;
          window.speechSynthesis.speak(msg);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

    console.log("first");
    setLoading(false);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setTranscription(transcript);
    if (answerMode === "audio") {
      setTimeout(() => {
        audioRef.current
          .play()
          .then(() => {
            audioRef.current.addEventListener("ended", () => getMessage());
            setMessage("");
          })
          .catch((error) => {
            console.error("Audio playback failed:", error);
          });
      }, 3000);
    } else {
      getMessage();
    }
  };

  recognition.onend = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  recognition.onerror = () => {
    setErrorMessage("Speak clear");
  };

  recognition.onstart = () => {
    setRecording(true);
    setTranscription("");
  };

  const startRecording = () => {
    setTranscription("");
    setErrorMessage("");
    mediaRecorderRef.current.start();
    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    recognition.abort();
    recognition.stop();
    setRecording(false);
  };

  useEffect(() => {
    const getUserMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        audioChunksRef.current = [];
      };
    };

    getUserMedia().catch((error) => {
      console.error("Error accessing audio:", error);
    });

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    setMessage("");
  }, [answerMode]);

  return (
    <div className="app-con">
      <h1>Voice Assistant Simulator</h1>
      <div className="content">
        <div className="response-mode row">
          <label htmlFor="">Response mode : </label>
          <div className="switch-response-mode-con">
            text :
            <input
              checked={answerMode === "text"}
              type="radio"
              name="response"
              id=""
              onChange={() => setAnswerMode("text")}
            />
            audio :
            <input
              type="radio"
              name="response"
              id=""
              onChange={() => setAnswerMode("audio")}
            />
          </div>
        </div>
        <div className="recorder row">
          <button
            onClick={recording ? stopRecording : startRecording}
            className="recorder-btn"
          >
            {recording ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                />
              </svg>
            )}
          </button>
          {recording && <span className="is-recording"></span>}
        </div>
      </div>
      <p>Transcription : {transcription}</p>
      <div className="response">
        {answerMode === "text" ? (
          <div className="typewriter">
            <h1>{message.message}</h1>
          </div>
        ) : (
          <>
            {answerMode === "audio" && (
              <audio
                style={{ display: "none" }}
                ref={audioRef}
                controls
                src={audioURL}
              ></audio>
            )}
            {message && (
              <div id="bars">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            )}
          </>
        )}
        {loading && <p>loading</p>}
        {errorMessage && <p>Error : {errorMessage}</p>}
      </div>
    </div>
  );
};

export default App;
