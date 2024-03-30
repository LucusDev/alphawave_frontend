import { useEffect, useRef, useState } from "react";
import "./App.css";
import {post} from "./api/service.ts"


function App() {
  const messageRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");
  const [recommendations,setRecommendations] = useState(['Warranty information','Where can I find troubleshooting tips for my laptop?','Specifications of AlphaWave X1','What are the discounts and promotions available?']);
  const [messages, setMessages] = useState<{ role: string; text: string; status:string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);    
  const [isDark, setDark] = useState(false);    

  const [loadingRecom, setLoadingRecom] = useState(true);    

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      GetResponse();
    }
  };
  async function getRecommendations() {
    try {
      const result = await post("chat/recommendations/",{
      },{});
      const text = result.data.message;
      setRecommendations((text as {'question':''}[]).map(questions => {
        return questions['question']??'';
       }));
       setLoadingRecom(false);
    } catch (error) {
      setLoadingRecom(false);
      console.error("generateContent error: ", error);
    }
  }
  async function handleCopyText(copyText: string) {
    navigator.clipboard.writeText(copyText);
  }

  const handleButtonClick = (msgIndex: number, status: string) => {
    setMessages(prevMessages => {
      return prevMessages.map((message, index) => {
        if (index === msgIndex) {
          return { ...message, status: status }; 
        }
        return message;
      });
    });
  };

  const handleFAQButton = (buttonText: string) => {
    GetResponse(buttonText);
  };
  function scrollToBottom() {
    setTimeout(() => {
        (messageRef.current as HTMLDivElement).scrollTop = (messageRef.current as HTMLDivElement).scrollHeight;
    }, 100);
  }
  function toggleDark(){
    if(isDark){
      document.body.classList.toggle('dark');
      setDark(false);
      saveDark(false);
    }
    else{
      document.body.classList.toggle('dark');
      setDark(true);
      saveDark(true);
    }
  }
  function saveDark(bool:boolean){
    localStorage.setItem("dark", bool?'1':'0');
  }
  async function GetResponse(text?: string){
    let messageText = text??inputText;
    if (messageText.length == 0 || loading) {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: messageText, status:"" },
    ]);

    setInputText("");
    setLoading(true);
    scrollToBottom();
    try {
      const result = await post("chat/",{
        "message":messageText,
        "history":messages
      },{});
      const text = result.data.message;

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", text: text, status:"" },
      ]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("generateContent error: ", error);
    }
  }
  useEffect(() => {
    getRecommendations();
    const dark = (localStorage.getItem("dark")??'')=='1';
    if(dark){
      document.body.classList.add('dark');
      setDark(true);
    }
  },[]);
  return (
    <div className={isDark?'container dark':'container'}>
      <div className="header">
        <div className="logo">
          <img alt="AlphaWave Logo" src={window.location.href+"assets/img/logo.png"}></img>
          <img alt="dark mode toggle" src={window.location.href+(isDark?"assets/svg/day.svg":"assets/svg/night.svg")} onClick={toggleDark}></img>
        </div>
      </div>
      {messages.length === 0 && (
        <div className="welcome-message">
          <h1>Welcome to AlphaWave Laptop Company's </h1>
          <h1>Dynamic Q&A Platform!</h1>
          <h2>Hello there!</h2>
          <p>
            We're thrilled to have you here. Whether you have questions about
            our cutting-edge products or need assistance with our services,
            we're here to help. Your satisfaction is our priority! Happy
            exploring!
          </p>
          {
            !loadingRecom && <div className="faq">
            {
              recommendations.map((recommendation,index) =><button key={index} onClick={() => handleFAQButton(recommendation)} >{recommendation}</button>)
            }
          </div>
          }
          
        </div>
      )}

      {messages.length != 0 && (
        <div className="message-list" ref={messageRef}>
          {messages.map((message, index) => {
            if (message.role == "user") {
              return (
                <div className="query" key={index}>
                  <p>{message.text}</p>
                </div>
              );
            }
            return (
              <div className="response" key={index}>
                <p>{message.text}</p>
                <button className={`thumbsup-button ${message.status === 'Thumbs-up' ? 'active' : ''}`}
                onClick={()=>handleButtonClick(index, 'Thumbs-up')}></button>
                <button className={`thumbsdown-button ${message.status === 'Thumbs-down' ? 'active' : ''}`}
                onClick={()=>handleButtonClick(index, 'Thumbs-down')}></button>
                <button className="copy-button" onClick={() => handleCopyText(message.text)}></button>
              </div>
            );
          })}

          {loading && (
            <div className="response">
              <p>Loading...</p>
            </div>
          )}

          {/* {!loading && (
            <div className="response">
              <button id="thumbsup-button"></button>
              <button id="thumbsdown-button"></button>
              <button id="copy-button"></button>
            </div>
          )} */}
        </div>
      )}

      <div className="input-area">
        <input
          type="text"
          id="question-input"
          placeholder="Enter your queries here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        ></input>
        <button className="send-button" onClick={() => GetResponse()}></button>
      </div>
    </div>
  );
}

export default App;
