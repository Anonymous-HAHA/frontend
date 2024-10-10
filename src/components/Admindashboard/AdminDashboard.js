import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ClipLoader from "react-spinners/ClipLoader";
import env from "../../env";
import './Style.css';

const AdminDashboard = () => {
  const [dailyQuote, setDailyQuote] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); // New username state
  const [mood, setMood] = useState("");
  const [quoteText, setQuoteText] = useState("");
  const [quoteImage, setQuoteImage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

  const handleRequest = async (requestFn) => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await requestFn();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    }
    setLoading(false);
  };

  const updateDailyQuote = () => {
    if (!dailyQuote) {
      setError("Daily quote is required");
      return;
    }
    handleRequest(async () => {
      const bearer = "Bearer " + Cookies.get("jwtToken");
      const response = await axios.post(
        `${env.SERVER_URL}/edit/todaysquote`,
        { quote: dailyQuote },
        { headers: { Authorization: bearer } }
      );
      setMessage(response.data);
    });
  };

  const addName = () => {
    if (!name || !username) {
      setError("Both name and username are required");
      return;
    }
    handleRequest(async () => {
      const bearer = "Bearer " + Cookies.get("jwtToken");
      const response = await axios.post(
        `${env.SERVER_URL}/add/name`,
        { name, username },
        { headers: { Authorization: bearer } }
      );
      setMessage(response.data);
      setName("");
      setUsername("");
    });
  };

  const addNewQuote = () => {
    if (!mood || !quoteText || !quoteImage) {
      setError("Mood, quote text, and quote image URL are required");
      return;
    }
    handleRequest(async () => {
      const bearer = "Bearer " + Cookies.get("jwtToken");
      const response = await axios.post(
        `${env.SERVER_URL}/add/quote`,
        { mood, quote: { text: quoteText, image: quoteImage } },
        { headers: { Authorization: bearer } }
      );
      setMessage(response.data.message);
      setMood("");
      setQuoteText("");
      setQuoteImage("");
    });
  };

  return (
    <div className="admin-dashboard">
      <h1 style={{ color: "#4b1248" }}>Admin Dashboard</h1>

      <div className="input-section">
        <h2>Add Name</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="input"
          required
        />
        <textarea
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the name"
          rows="2"
          className="textarea"
          required
        />
        <button onClick={addName} style={buttonStyle} disabled={loading}>
          Add Name
        </button>
      </div>

      <div className="input-section">
        <h2>Update Daily Quote</h2>
        <textarea
          value={dailyQuote}
          onChange={(e) => setDailyQuote(e.target.value)}
          placeholder="Enter the daily quote"
          rows="4"
          className="textarea"
          required
        />
        <button onClick={updateDailyQuote} style={buttonStyle} disabled={loading}>
          Update Daily Quote
        </button>
      </div>

      <div className="input-section">
        <h2>Add New Quote</h2>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Enter mood (happy, sad, etc.)"
          className="input"
          required
        />
        <textarea
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          placeholder="Enter the quote text"
          rows="4"
          className="textarea"
          required
        />
        <input
          type="text"
          value={quoteImage}
          onChange={(e) => setQuoteImage(e.target.value)}
          placeholder="Enter the quote image URL"
          className="input"
          required
        />
        <button onClick={addNewQuote} style={buttonStyle} disabled={loading}>
          Add New Quote
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <ClipLoader color="#4b1248" loading={loading} size={35} />
        </div>
      )}
      
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#4b1248",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

export default AdminDashboard;
