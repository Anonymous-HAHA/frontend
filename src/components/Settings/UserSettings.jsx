import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ClipLoader } from "react-spinners";
import env from "../../env";

const UserSettings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== retypePassword) {
      setError("New Password and Retype Password must match.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const bearer = "Bearer " + Cookies.get("jwtToken");
      const response = await axios.post(
        `${env.SERVER_URL}/change/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: bearer } }
      );

      setMessage("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setRetypePassword("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
          Change Password
        </h1>
        <form className="space-y-4" onSubmit={handleChangePassword}>
          <div>
            <label htmlFor="oldPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="retypePassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Retype New Password
            </label>
            <input
              type="password"
              id="retypePassword"
              placeholder="Retype New Password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : 'Change Password'}
          </button>
          {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default UserSettings;
