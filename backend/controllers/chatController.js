const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleChat = async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

   const prompt = `
You are an expert Ayurvedic chatbot with 10 years of experience.

User query: "${message}"

✅ Respond in this strict format:

🌿 Ayurveda Advice

🩺 Problem:
[A concise summary of the user's issue]

🪴 Remedies:
• Remedy 1
• Remedy 2
• Remedy 3

💬 Next questions the user may ask:
• [user-style follow-up, max 5 words]
• [user-style follow-up, max 5 words]
• [user-style follow-up, max 5 words]

⚠️ Follow these strict rules:
- Each suggestion must sound like a user would naturally type it.
- Use max 5 words per suggestion.
- DO NOT generate questions like a doctor or assistant (e.g., "How long have you had it?" is invalid).
- DO NOT repeat the original query.
- DO NOT use quotation marks.
- DO NOT use markdown or HTML.
- Format EXACTLY as shown.
- Keep the full reply under 150 words.
`;

    const result = await model.generateContent(prompt);
    const fullText = result.response.text().trim();

    // --- Parse and separate advice and follow-ups ---
    const lines = fullText.split("\n");
    const cleanLines = [];
    const followups = [];
    let isFollowup = false;

    for (const line of lines) {
      // Normalize line to lowercase and remove spaces for consistent detection
      const normalized = line.toLowerCase().replace(/\s+/g, "");
      console.log(normalized)

      if (
        normalized.includes("💬nextquestionstheusermayask") ||
        normalized.includes("nextquestionstheusermayask")
      ) {
        isFollowup = true;
        continue;
      }

      if (isFollowup) {
        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
          followups.push(line.replace(/^[-•]\s*/, "").trim());
        }
      } else {
        cleanLines.push(line);
      }
    }

    const formattedAdvice = cleanLines.join("\n").trim();
    console.log(followups)

    res.json({ advice: formattedAdvice, followups });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({
      advice: "⚠️ Gemini API error. Try again later.",
      followups: [],
    });
  }
};

module.exports = { handleChat };
