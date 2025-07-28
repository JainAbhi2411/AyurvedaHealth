import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const getAyurvedaAdvice = async (message) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/chat`, { message }, {
      timeout: 10000, // Optional timeout of 10s
    });

    // Expecting { advice, followups }
    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching Ayurvedic advice:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return {
      advice: "⚠️ Unable to get Ayurvedic advice right now. Please try again later.",
      followups: [],
    };
  }
};
