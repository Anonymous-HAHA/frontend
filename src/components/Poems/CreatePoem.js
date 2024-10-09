import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to retrieve the token
import env from '../../env';

export default function CreatePoem() {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      // Retrieve the Bearer token from cookies
      const token = Cookies.get('jwtToken'); // Assuming you store the token in a cookie named 'jwtToken'
      
      const response = await axios.post(`${env.SERVER_URL}/add/poem`, {
        poem: content,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Bearer token in the headers
        },
      });

      // Handle success response
      console.log('Poem submitted:', response.data);
      setContent(""); // Clear the editor
    } catch (error) {
      // Handle error
      console.error('Error submitting poem:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Write Your Poem</h1>
      <JoditEditor
        ref={editor}
        value={content}
        onChange={(newContent) => setContent(newContent)}
      />
      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Submit Poem
      </button>
    </div>
  );
}
