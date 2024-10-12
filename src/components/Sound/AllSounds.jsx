import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlayCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { Dialog } from "@headlessui/react";
import Cookies from 'js-cookie';
import env from "../../env";

const AllSounds = () => {
  const [sounds, setSounds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSoundsLoading, setIsSoundsLoading] = useState(true); // New loading state

  useEffect(() => {
    const token = Cookies.get('jwtToken');
    const fetchSounds = async () => {
      if (!token) {
        console.error("JWT token not found.");
        return;
      }

      try {
        setIsSoundsLoading(true); // Set loading state to true before fetching
        const response = await axios.get(`${env.SERVER_URL}/get/sounds`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSounds(response.data);
      } catch (error) {
        console.error("Error fetching sounds:", error);
      } finally {
        setIsSoundsLoading(false); // Set loading state to false after fetching
      }
    };
    fetchSounds();
  }, []);

  const handlePlaySound = async (soundId) => {
    setIsLoading(true);
    setIsModalOpen(true);

    try {
      const response = await axios.get(`${env.SERVER_URL}/get/sounds/download/${soundId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('jwtToken')}`,
        },
        responseType: "blob"
      });
      const audioURL = URL.createObjectURL(new Blob([response.data]));
      setCurrentSound(audioURL);
    } catch (error) {
      console.error("Error fetching sound file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSound(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f7f9fc',
      padding: '2rem',
      fontFamily: "'Roboto', sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#334155',
          marginBottom: '1.5rem'
        }}>
          Voice Recordings
        </h1>

        {isSoundsLoading ? ( // Show loading spinner while fetching sounds
          <ClipLoader color="#000" loading={isSoundsLoading} size={50} />
        ) : sounds.length === 0 ? (
          <p style={{
            color: '#64748b',
            fontSize: '1.25rem'
          }}>No voice messages yet</p>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {sounds.map((sound) => (
              <button
                key={sound._id}
                onClick={() => handlePlaySound(sound._id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  transition: 'background-color 0.3s'
                }}
              >
                <FaPlayCircle size={24} />
                <span>{sound.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={closeModal}>
          <div style={{
            position: 'fixed',
            zIndex: 10,
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '500px'
            }}>
              <div style={{
                padding: '1.5rem',
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: '#334155',
                  marginBottom: '1rem'
                }}>Playing Sound</h3>
                {isLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ClipLoader color="#000" loading={isLoading} size={50} />
                  </div>
                ) : (
                  currentSound && (
                    <audio controls style={{
                      width: '100%',
                      marginTop: '1rem'
                    }}>
                      <source src={currentSound} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )
                )}
              </div>
              <div style={{
                backgroundColor: '#f1f5f9',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={closeModal}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    fontWeight: '500',
                    transition: 'background-color 0.3s'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default AllSounds;
