import React from "react";

const VoiceInput = ({ onVoiceInput }) => {
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onVoiceInput(transcript);
    };

    recognition.start();
  };

  return (
    <button
      onClick={startListening}
      style={{
        padding: "12px 20px",
        background: "#ff7043",
        color: "white",
        fontWeight: "bold",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      🎤
    </button>
  );
};

export default VoiceInput;