import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import env from "../env";
import Cookies from "js-cookie";
import { ClipLoader } from 'react-spinners';

function Login() {
  const navigate = useNavigate();
  const [checkingToken, setCheckingToken] = useState(true);
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    if (token !== undefined) {
      navigate("/", { replace: true });
    } else {
      setCheckingToken(false);
    }
  }, [navigate]);

  const submitClicked = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const userDetails = { username, password };
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    try {
      if (userDetails.username === "" || userDetails.password === "") {
        setIncorrectCredentials(true);
        setErrorMessage("Please fill in both fields.");
        setLoading(false);
        return;
      }
  
      const res = await axios.post(`${env.SERVER_URL}/login`, userDetails, options);
      const data = res.data;
  
      if (res.status === 200) {
        submitSuccess(data.jwtToken,data.role);
      } else {
        setIncorrectCredentials(true);
        setErrorMessage("Wrong credentials. Please try again."); 
      }
    } catch (error) {
      console.log(error);
  
      // Check if error.response and error.response.data exist before accessing them
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data); 
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
      setIncorrectCredentials(true);
    } finally {
      setLoading(false);
    }
  };

  const submitSuccess = (jwtToken,role) => {
    Cookies.set("jwtToken", jwtToken, {
      expires: 30,
      path: "/",
    });
    Cookies.set("role", role, {
        expires: 30,
        path: "/",
      });
    navigate("/", { replace: true });
  };

  if (checkingToken) {
    return null; 
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
          Welcome Back! 👋
        </h1>
        <form className="space-y-4" onSubmit={submitClicked}>
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : 'Sign in'}
          </button>
          {incorrectCredentials && (
            <p className="mt-4 text-red-600 text-center">{errorMessage}</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Login;
