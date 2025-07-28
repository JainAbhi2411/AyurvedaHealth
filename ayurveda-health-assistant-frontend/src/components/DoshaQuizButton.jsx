import React from "react";

const DoshaQuizButton = () => {
  const handleDoshaQuiz = () => {
    alert(
      "🧘 Dosha Quiz coming soon!\nThis quiz will help you identify your Ayurvedic constitution (Vata, Pitta, or Kapha)."
    );
  };

  return (
    <button
      onClick={handleDoshaQuiz}
      style={{
        backgroundColor: "#ff7043",
        color: "white",
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        marginBottom: "16px",
        alignSelf: "center",
      }}
    >
      🧘 Take the Dosha Quiz
    </button>
  );
};

export default DoshaQuizButton;
