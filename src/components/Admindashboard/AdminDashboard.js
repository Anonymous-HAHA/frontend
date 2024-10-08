import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import env from "../../env"; // Adjust this import as necessary
import './Style.css';

const AdminDashboard = () => {
  const [dailyQuote, setDailyQuote] = useState("");
  const [name, setName] = useState("");
  const [mood, setMood] = useState("");
  const [quoteText, setQuoteText] = useState("");
  const [quoteImage, setQuoteImage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Function to update daily quote
  const updateDailyQuote = async () => {
    try {
      const bearer = "Bearer " + Cookies.get("jwtToken");
      const response = await axios.post(
        `${env.SERVER_URL}/edit/todaysquote`,
        { quote: dailyQuote },
        { headers: { Authorization: bearer } }
      );
      setMessage(response.data);
      setError("");
    } catch (err) {
      setError("Error updating daily quote: " + err.message);
    }
  };

  const addName = async () => {
    try {
      const bearer = "Bearer " + Cookies.get("jwtToken");
      const response = await axios.post(
        `${env.SERVER_URL}/add/name`,
        { name: name },
        { headers: { Authorization: bearer } }
      );
      setMessage(response.data);
      setError("");
      setName("");
    } catch (err) {
      setError("Error updating daily quote: " + err.message);
    }
  };

  // Function to add a new quote
  const addNewQuote = async () => {
    try {
      const bearer = "Bearer " + Cookies.get("jwtToken");
      const response = await axios.post(
        `${env.SERVER_URL}/add/quote`,
        { mood, quote: { text: quoteText, image: quoteImage } },
        { headers: { Authorization: bearer } }
      );
      setMessage(response.data.message);
      setError("");
      // Clear input fields after successful addition
      setMood("");
      setQuoteText("");
      setQuoteImage("");
    } catch (err) {
      setError("Error adding new quote: " + err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 style={{ color: "#4b1248" }}>Admin Dashboard</h1>

      <div className="input-section">
        <h2>Add Name</h2>
        <textarea
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the name"
          rows="2"
          className="textarea"
        />
        <button onClick={addName} style={buttonStyle}>
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
        />
        <button onClick={updateDailyQuote} style={buttonStyle}>
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
        />
        <textarea
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          placeholder="Enter the quote text"
          rows="4"
          className="textarea"
        />
        <input
          type="text"
          value={quoteImage}
          onChange={(e) => setQuoteImage(e.target.value)}
          placeholder="Enter the quote image URL"
          className="input"
        />
        <button onClick={addNewQuote} style={buttonStyle}>
          Add New Quote
        </button>
      </div>

      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

// Styles for the buttons and input fields
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
