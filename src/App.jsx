import { useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const [recording, setRecording] = useState(false);
  const [responseMode, setResponseMode] = useState("text");
  const [transcription, setTranscription] = useState("");
  const [audioURL, setAudioURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

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
        if (responseMode === "audio") {
          msg.text = res.message;
          msg.onend = () => {
            setMessage("");
          };
          window.speechSynthesis.speak(msg);
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(err.message);
        setLoading(false);
      });

    setLoading(false);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setTranscription(transcript);
    if (responseMode === "audio") {
      setTimeout(() => {
        audioRef.current
          .play()
          .then(() => {
            audioRef.current.addEventListener("ended", () => {
              getMessage();
              setAudioURL("");
            });
            setMessage("");
          })
          .catch((err) => {
            console.error("Audio playback failed:", err);
            setErrorMessage("Audio playback failed:", err.message);
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
    recognition.start();
    setTranscription("");
    setRecording(true);
    setErrorMessage("");
    setMessage("");
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  useEffect(() => {
    const getUserMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        audioChunksRef.current = [];
      };
    };

    getUserMedia().catch((err) => {
      console.error("Error accessing audio:", err);
      setErrorMessage(err.message);
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
    setTranscription("");
    setAudioURL("");
  }, [responseMode]);

  return (
    <div className="app-con">
      <div className="header">
        <h2>Voice Assistant Simulator</h2>
        <div className="response-mode">
          <label htmlFor="">Response mode : </label>
          <div className="switch-response-mode-con">
            <div className="switch-response-mode">
              <input
                type="radio"
                id="text-mode"
                name="response-mode"
                checked={responseMode === "text"}
                onChange={() => setResponseMode("text")}
              />
              <label htmlFor="text-mode">Text</label>
              <input
                type="radio"
                id="audio-mode"
                name="response-mode"
                onChange={() => setResponseMode("audio")}
              />
              <label htmlFor="audio-mode">Audio</label>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`response ${responseMode === "audio" && "audio-response"}`}
      >
        {
          !audioURL && !message && !loading?
          <h3 className="assistant-default-text">How can I assist you ?</h3> : ""
        }
        {errorMessage ? (
          <h3 className="error-message">{errorMessage}</h3>
        ) : (
          <>
            {responseMode === "text" ? (
              transcription && (
                <>
                  <p>You : {transcription}</p>
                  <p>
                    <span className="assistant-response">Assistant :</span>{" "}
                    {loading ? <span class="isTyping"></span> : message.message}
                  </p>
                </>
              )
            ) : (
              <>
                {audioURL && (
                  <audio ref={audioRef} controls src={audioURL}></audio>
                )}
                {loading ? (
                  <div className="isTyping-con">
                    <span class="isTyping"></span>
                  </div>
                ) : (
                  message && (
                    <div id="visualizer">
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
                  )
                )}
              </>
            )}
          </>
        )}
      </div>
      <div className={`recorder ${recording && "is-recording"}`}>
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
        {recording && (
          <>
            <span className="blink-on-recording"></span>
            <p>Recording</p>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
