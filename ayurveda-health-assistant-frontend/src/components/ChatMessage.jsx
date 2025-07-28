import React from "react";

const ChatMessage = ({ sender, text }) => {
  const styles = {
    message: {
      margin: "8px 0",
      padding: "12px",
      borderRadius: "6px",
      maxWidth: "80%",
      whiteSpace: "pre-wrap",
      alignSelf: sender === "user" ? "flex-end" : "flex-start",
      backgroundColor: sender === "user" ? "#e8f5e9" : "#dcedc8",
      textAlign: "left",
    },
    sectionTitle: {
      fontWeight: "bold",
      fontSize: "16px",
      margin: "10px 0 4px",
    },
    paragraph: {
      margin: "4px 0",
    },
    ul: {
      paddingLeft: "20px",
      margin: "4px 0",
    },
    li: {
      listStyleType: "disc",
      marginBottom: "4px",
    },
  };

  const formatText = (text) => {
    if (!text || typeof text !== "string") return null;

    const lines = text.split("\n");
    const formatted = [];
    let bulletBuffer = [];

    const flushBullets = () => {
      if (bulletBuffer.length) {
        formatted.push(
          <ul key={`ul-${formatted.length}`} style={styles.ul}>
            {bulletBuffer.map((item, idx) => (
              <li key={idx} style={styles.li}>
                {item}
              </li>
            ))}
          </ul>
        );
        bulletBuffer = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) return;

      if (trimmed.startsWith("•")) {
        bulletBuffer.push(trimmed.slice(1).trim());
      } else {
        flushBullets();
        if (
          trimmed.startsWith("🌿") ||
          trimmed.startsWith("🩺") ||
          trimmed.startsWith("🪴") ||
          trimmed.startsWith("💬")
        ) {
          formatted.push(
            <p key={`title-${idx}`} style={styles.sectionTitle}>
              {trimmed}
            </p>
          );
        } else {
          formatted.push(
            <p key={`p-${idx}`} style={styles.paragraph}>
              {trimmed}
            </p>
          );
        }
      }
    });

    flushBullets();
    return <div>{formatted}</div>;
  };

  return <div style={styles.message}>{formatText(text)}</div>;
};

export default ChatMessage;
