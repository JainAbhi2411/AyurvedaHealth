import React from "react";

const WellnessTipCard = ({ tip }) => {
  return (
    <div
      style={{
        background: "#fff8e1",
        color: "#6d4c41",
        padding: "10px 16px",
        borderRadius: "10px",
        margin: "16px 0",
        fontSize: "15px",
        fontStyle: "italic",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      🌞 Tip of the Day: {tip}
    </div>
  );
};

export default WellnessTipCard;