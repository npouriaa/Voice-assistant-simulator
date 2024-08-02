import React from "react";

const MainApp = () => {
  return (
    <div className="app-con">
      <h1>Voice Assistant Simulator</h1>
      <div className="content">
        <div className="response-mode row">
          <label htmlFor="">Response mode : </label>
          <div className="switch-response-mode-con">
            <input
              type="checkbox"
              id="switch-response"
              className="toggle-response-mode"
            />
            <label for="switch-response" class="switchCon">
              <div>Text</div>
              <div>Audio</div>
            </label>
          </div>
        </div>
        <div className="recorder row">
          <button className="recorder-btn">
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
          </button>
          <span className="is-recording"></span>
        </div>
      </div>
      <div className="response">
        {/* <div className="typewriter">
          <h1>The cat and the hat.</h1>
        </div> */}
        {/* <div id="bars">
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
        </div> */}
      </div>
    </div>
  );
};

export default MainApp;
