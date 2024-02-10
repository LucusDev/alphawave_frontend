import { useState } from 'react'
import './App.css'
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const API_KEY = "";
  const genAI = new GoogleGenerativeAI(API_KEY);
  const [inputText, setInputText] = useState("");

  async function GetResponse() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(inputText);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }
/*
  const sendMessage = async (inputText) => {
    if (!inputText) {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, sender: "user", timestamp: new Date() },
    ]);
  
    setLoading(true);
  
    try {
      const result = await model.generateContent(inputText);
      const text = result.response.text();
  
      // Check if the response is code before updating messages
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: text,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
  
      // Update messages with the AI response
  
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("generateContent error: ", error);
      }
  };
  */
  
    
  return (
    <div className="container">
      <div className="header">
        <div className="logo"><img alt="AlphaWave Logo"></img></div>
      </div>
      <div className="welcome-message">
        <h1>Welcome to AlphaWave Laptop Company's Dynamic Q&A Platform!</h1>
        <h2>Hello there!</h2>
        <p>We're thrilled to have you here. Whether you have questions about our cutting-edge products or need assistance with our services, we're here to help. Your satisfaction is our priority! Happy exploring!</p>
      </div>
      <div className="input-area">
        <input type="text" id="question-input" placeholder="Enter your queries here..." value={inputText} onChange={(e) => setInputText(e.target.value)}></input>
        <button className="send-button" onClick={() => GetResponse()}>&rarr;</button>
      </div>
    </div>
  )
}

export default App
