import "./App.css";
import axios from "axios";
import { useState } from "react";
import React from "react";
import ReactDOM from "react-dom";



function App() {
  
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts
    setError(""); // Clear any previous error
    setResponse(""); // Clear any previous response

    axios
    .post("http://localhost:8080/chat/", { prompt })
      .then((res) => {
        setResponse(res.data.response); // Set response from server
        setLoading(false); // End loading
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Failed to fetch response. Please try again.");
        setLoading(false); // End loading even if there's an error
      });
  };

  return (
    <div className="App">
      <h1>Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {response && (
        <div className="response">
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;
