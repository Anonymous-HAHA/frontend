import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import env from '../../env';
import ClipLoader from 'react-spinners/ClipLoader';

const AllDrawings = () => {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const token = Cookies.get('jwtToken');

  const fetchDrawings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${env.SERVER_URL}/get/drawings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDrawings(response.data);
    } catch (error) {
      console.error('Error fetching drawings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    fetchDrawings();
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold mb-6">All Drawings</h2>
      {loading ? (
        <ClipLoader loading={loading} size={50} />
      ) : drawings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl">
          {drawings.map((drawing) => (
            <div 
              key={drawing._id} 
              className="relative m-2 rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleImageClick(drawing.pic)}
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={`${drawing.pic}`} // Use the pic property for the image
                  alt={`Drawing ${drawing.title}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-black opacity-25"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                {drawing.title}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">No images yet.</p>
      )}

      {/* Modal for displaying full screen image */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={handleCloseModal}>
          <img src={selectedImage} alt="Selected Drawing" className="max-w-full max-h-full p-4" />
          <button className="absolute top-5 right-5 text-white text-2xl" onClick={handleCloseModal}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default AllDrawings;
