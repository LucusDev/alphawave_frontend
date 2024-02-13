import { useState } from 'react'
import './App.css'
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const API_KEY = "";
  const genAI = new GoogleGenerativeAI(API_KEY);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<{ role: string; parts: { text: string; }[] }[]>([]);
  const [loading, setLoading] = useState(false);

  async function GetResponse() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    if (!inputText) {
      return;
    }

    setMessages(prevMessages => [
      ...prevMessages, { role: "user", parts: [{ text: inputText }] }
    ]);

    // setInputText("");
    setLoading(true);

    try {
      const result = await model.generateContent(inputText);
      const response = await result.response;
      const text = response.text();

      setMessages(prevMessages => [...prevMessages, { role: "ai", parts: [{ text: text }] }]);
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      console.error("generateContent error: ", error);
    }
  }
    
  return (
    <div className="container">
      <div className="header">
        <div className="logo"><img alt="AlphaWave Logo" src='src/assets/img/logo.png'></img></div>
      </div>
      {messages.length === 0 &&
        <div className="welcome-message">
          <h1>Welcome to AlphaWave Laptop Company's </h1>
          <h1>Dynamic Q&A Platform!</h1>
          <h2>Hello there!</h2>
          <p>We're thrilled to have you here. Whether you have questions about our cutting-edge products or need assistance with our services, we're here to help. Your satisfaction is our priority! Happy exploring!</p>
        </div>
      }

      {messages.length != 0 &&(
        <div>
          <div className='query'>
            <p>{inputText}</p>
          </div>
          {loading && (
            <div className="response">
              <p >Loading...</p>
            </div>
          )}

          {!loading && (
            <div className="response">
              {messages[messages.length - 1].parts.map((part, index) => (
                <p key={index}>{part.text}</p>
              ))}
              <button id="thumbsup-button"></button>
              <button id="thumbsdown-button"></button>
              <button id="copy-button"></button>
            </div>
          )}
        </div>
      )}
      
      <div className="input-area">
        <input type="text" id="question-input" placeholder="Enter your queries here..." value={inputText} onChange={(e) => setInputText(e.target.value)}></input>
        <button className="send-button" onClick={() => GetResponse()}></button>
      </div>
    </div>
  )
}

export default App
