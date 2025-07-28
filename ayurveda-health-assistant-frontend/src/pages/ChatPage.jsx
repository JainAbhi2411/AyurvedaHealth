import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage.jsx";
import VoiceInput from "../components/VoiceInput.jsx";
import WellnessTipCard from "../components/WellnessTipCard.jsx";
import { getAyurvedaAdvice } from "../services/api";
import './ChatPage.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "🧘‍♂️ Namaste! I am your Ayurveda assistant. Tell me about your symptoms, and I’ll guide you naturally.",
    },
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState("");
  const speechRef = useRef(null);

  const tips = [
    "🌿 Drink warm water every morning to stimulate digestion.",
    "🧘 Practice deep breathing for 5 minutes daily to reduce stress.",
    "🍋 Start your day with lemon and honey in warm water.",
    "🥦 Favor cooked, seasonal vegetables for better digestion.",
    "🌞 Get 20 minutes of morning sunlight for vitality.",
  ];

  useEffect(() => {
    const today = new Date().getDate();
    setTip(tips[today % tips.length]);
  }, []);

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  };

  const formatAdvice = (raw) => {
    const lines = raw.split("\n").filter((l) => l.trim());

    let problemLine = "";
    let remedies = [];
    let readingRemedies = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("🩺")) {
        problemLine = lines[i + 1]?.trim() || "";
      }

      if (line.startsWith("🪴")) {
        readingRemedies = true;
        continue;
      }

      if (line.startsWith("💬")) {
        break;
      }

      if (readingRemedies && /^[-•*]/.test(line)) {
        remedies.push(line.replace(/^[-•*]\s*/, "").trim());
      }
    }

    return { problemLine, remedies };
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    stopSpeaking();
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);
    setSuggestions([]);

    try {
      const { advice, followups } = await getAyurvedaAdvice(text);
      const { problemLine, remedies } = formatAdvice(advice);

      const formatted = `🌿 Ayurveda Advice\n\n🩺 Problem:\n${problemLine}\n\n🪴 Remedies:\n${remedies
        .map((r) => `• ${r}`)
        .join("\n")}`;

      const utterance = new SpeechSynthesisUtterance(formatted);
      utterance.lang = "en-IN";
      speechSynthesis.speak(utterance);
      speechRef.current = utterance;

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: formatted,
        },
      ]);
      setSuggestions(followups);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Something went wrong. Please try again later.",
        },
      ]);
    }

    setLoading(false);
  };


  return (
    <div className="page">
       <img src="https://cdn-icons-png.flaticon.com/128/5806/5806342.png" className="animated-icon icon1" alt="leaf" />
      <img src="https://cdn-icons-png.flaticon.com/128/1202/1202099.png" className="animated-icon icon2" alt="clove" />
      <img src="https://cdn-icons-png.flaticon.com/128/2901/2901355.png" className="animated-icon icon3" alt="rocksalt" />
      <img src="https://cdn-icons-png.flaticon.com/128/6866/6866595.png" className="animated-icon icon4" alt="lemon" />
      <img src="https://cdn-icons-png.flaticon.com/128/13523/13523349.png" className="animated-icon icon5" alt="neem" />
      <img src="https://cdn-icons-png.flaticon.com/128/3413/3413290.png" className="animated-icon icon6" alt="leaf" />
      <img src="https://cdn-icons-png.flaticon.com/128/4165/4165744.png" className="animated-icon icon7" alt="clove" />
      <div className="container">
        <div className="header">
          <div className="title">🌿 Ayurveda Health Chatbot</div>
          <div className="tagline">Healing naturally through ancient wisdom</div>
        </div>

        <WellnessTipCard tip={tip} />

        <div className="chatBox">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
          ))}
          {loading && <ChatMessage sender="bot" text="🕐 Analyzing your symptoms..." />}

          {suggestions.length > 0 && (
            <div className="suggestionBox">
              {suggestions.map((s, idx) => (
                <button key={idx} className="suggestionBtn" onClick={() => handleSend(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="inputArea">
          <input
            type="text"
            className="input"
            placeholder="Describe your symptoms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <VoiceInput onVoiceInput={(voiceText) => setInput(voiceText)} />
          <button className="button" onClick={() => handleSend()} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
