import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import Cookies from 'js-cookie'; // Make sure to import js-cookie to retrieve the token
import env from '../../env'; // Import your environment variables

const Poems = () => {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        // Retrieve the Bearer token from cookies (or local storage)
        const token = Cookies.get('jwtToken'); // Assuming you store the token in a cookie named 'jwtToken'
        
        const response = await axios.get(`${env.SERVER_URL}/get/poems`, {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Bearer token in the headers
          },
        });

        setPoems(response.data);
      } catch (err) {
        console.error('Error fetching poems:', err);
        setError('Could not retrieve poems');
      } finally {
        setLoading(false);
      }
    };

    fetchPoems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <ClipLoader color="#4A5568" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-96 relative p-4"> 
      {error && <div className="text-red-500">{error}</div>}
      {poems.length === 0 ? (
        <div className="text-center py-4">No poems yet.</div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Poems</h1> {/* Style the title */}
          {poems.map((poem, index) => (
            <div
              key={index}
              className="p-4 border border-gray-300 rounded-md shadow-sm bg-white w-full max-w-md mx-auto mb-4 transition-transform transform hover:scale-105" // Added styles
            >
              <p dangerouslySetInnerHTML={{ __html: poem.poem }} className="text-gray-700" /> {/* Optional: style the poem text */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Poems;
