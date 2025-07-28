const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const chatRoutes = require("./routes/chat");

const app = express();
app.use(cors({
  origin: "https://ayurvedahelp.netlify.app",
}));
app.use(express.json());
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log("Visitor IP:", ip);
  next();
});
app.use("/api/chat", chatRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
