import React, { useState } from 'react';
import axios from 'axios';
import env from "../../env";
import Cookies from 'js-cookie'; // Import js-cookie to retrieve the token
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader

const SendNotification = () => {
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if all fields are filled
  const isFormValid = username && title && message;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = Cookies.get('jwtToken');
      const response = await axios.post(`${env.SERVER_URL}/send/notification`, { username, title, message }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Send Notification</h2>
      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        {/* Title input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        {/* Message input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            required 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || !isFormValid}  // Disable if loading or form is invalid
          className={`w-full p-2 text-white font-semibold rounded-md focus:outline-none ${loading || !isFormValid ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Sending...' : 'Send Notification'}
        </button>
        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
        {success && <p className="mt-2 text-green-600 text-sm">{success}</p>}
      </form>

      {loading && (
        <div className="flex justify-center mt-4">
          <ClipLoader 
            color="#1D4ED8" // Tailwind Blue 600
            loading={loading}
            size={35} // Size of the loader
          />
        </div>
      )}
    </div>
  );
};

export default SendNotification;
