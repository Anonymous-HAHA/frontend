import React, { useState, useEffect } from "react";
import axios from "axios";
import env from "../../env";
import Cookies from "js-cookie";
import './Style.css';
import { ClipLoader } from "react-spinners";

const LandingPage = () => {
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [dailyQuote, setDailyQuote] = useState("Loading your daily quote...");
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(""); 
  const [loading, setLoading] = useState(false);

  // Fetch daily quote on page load
  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        const bearer = "Bearer " + Cookies.get("jwtToken");
        const response = await axios.get(`${env.SERVER_URL}/get/todaysquote`, {
          headers: { Authorization: bearer }
        });
        setDailyQuote(response.data);
      } catch (err) {
        setError("Error loading daily quote");
      }
    };
    fetchDailyQuote();

    const fetchName = async () => {
        try {
          const bearer = "Bearer " + Cookies.get("jwtToken");
          const response = await axios.get(`${env.SERVER_URL}/get/name`, {
            headers: { Authorization: bearer }
          });
          setName(response.data);
        } catch (err) {
          setError("Error loading name");
        }
      };
      fetchName();
  }, []);

  // Function to fetch random quote based on mood
  const fetchQuote = async (selectedMood) => {
    setError(null);
    setLoading(true);
    try {
      const bearer = "Bearer " + Cookies.get("jwtToken");
      const response = await axios.get(`${env.SERVER_URL}/get/quotes/random?mood=${selectedMood}`, {
        headers: { Authorization: bearer }
      });
      const { text, image } = response.data;
      setQuote(text);
      setBackgroundImage(image || ""); // Ensure image is either a valid URL or empty
    } catch (err) {
      setError("Error fetching quote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="container" 
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      }}
    >
      <h1>For You, My Wonderful Friend,{name}</h1>
      <p style={{ fontSize: "1.5rem", color: "#ffe6e6" }}>
        {dailyQuote}
      </p>
      <p style={{ color: "#ffe6e6" }}>
        Thank you for always being there. Pick how you’re feeling and let me try to make your day a little brighter.
      </p>
      <div className="buttons">
        {["happy", "sad", "angry", "frustrated", "demotivated"].map((mood) => (
          <button 
            key={mood} 
            className="mood-button" 
            onClick={() => fetchQuote(mood)}
          >
            {mood.charAt(0).toUpperCase() + mood.slice(1)} 😊
          </button>
        ))}
      </div>
      <p style={{ color: "#ffe6e6" }}>{quote}</p>
      {loading && <ClipLoader color="#ffffff" size={50} />}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LandingPage;
