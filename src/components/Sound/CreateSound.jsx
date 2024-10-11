import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlayCircle, FaTrash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { Dialog } from "@headlessui/react";
import Cookies from 'js-cookie';
import env from "../../env";

const CreateSound = () => {
  const [sounds, setSounds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSoundsLoading, setIsSoundsLoading] = useState(true);
  const [newSound, setNewSound] = useState({ title: "", file: null });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = Cookies.get('jwtToken');
    const fetchSounds = async () => {
      if (!token) {
        console.error("JWT token not found.");
        return;
      }

      try {
        setIsSoundsLoading(true);
        const response = await axios.get(`${env.SERVER_URL}/get/sounds`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSounds(response.data);
      } catch (error) {
        console.error("Error fetching sounds:", error);
      } finally {
        setIsSoundsLoading(false);
      }
    };
    fetchSounds();
  }, []);

  const handlePlaySound = async (soundId) => {
    setIsLoading(true);
    setIsModalOpen(true);
    setErrorMessage(""); // Reset error message

    try {
      const response = await axios.get(`${env.SERVER_URL}/get/sounds/download/${soundId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('jwtToken')}`,
        },
        responseType: "blob",
      });
      const audioURL = URL.createObjectURL(new Blob([response.data]));
      setCurrentSound(audioURL);
    } catch (error) {
      console.error("Error fetching sound file:", error);
      setErrorMessage("Failed to fetch sound file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSound = async (soundId) => {
    setIsLoading(true); // Set loading state
    setErrorMessage(""); // Reset error message

    try {
      const token = Cookies.get('jwtToken');
      await axios.delete(`${env.SERVER_URL}/delete/sound/${soundId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSounds(sounds.filter(sound => sound._id !== soundId));
    } catch (error) {
      console.error("Error deleting sound:", error);
      setErrorMessage("Failed to delete sound.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleSoundUpload = async () => {
    if (!newSound.title || !newSound.file) {
      setErrorMessage("Please fill in the fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newSound.title);
    formData.append("soundFile", newSound.file);

    setIsLoading(true); // Set loading state
    setErrorMessage(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    try {
      const token = Cookies.get('jwtToken');
      await axios.post(`${env.SERVER_URL}/add/sound`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage("Sound uploaded successfully!");
      setNewSound({ title: "", file: null }); // Reset form
      // Re-fetch sounds after upload
      const response = await axios.get(`${env.SERVER_URL}/get/sounds`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSounds(response.data);
    } catch (error) {
      console.error("Error uploading sound:", error);
      setErrorMessage("Failed to upload sound.");
    } finally {
      setIsLoading(false); // Reset loading state
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
          Voice Recordings - Admin
        </h1>

        {isSoundsLoading ? (
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
              <div key={sound._id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                <button
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
                <button
                  onClick={() => handleDeleteSound(sound._id)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                >
                  <FaTrash size={24} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '0.5rem',
          backgroundColor: '#fff',
        }}>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            color: '#334155',
          }}>Create New Sound</h2>
          <input
            type="text"
            placeholder="Sound Title"
            value={newSound.title}
            onChange={(e) => setNewSound({ ...newSound, title: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              borderRadius: '0.25rem',
              border: '1px solid #ddd'
            }}
          />
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setNewSound({ ...newSound, file: e.target.files[0] })}
            style={{ marginBottom: '1rem' }}
          />
          <button
            onClick={handleSoundUpload}
            disabled={isLoading}
            style={{
              backgroundColor: '#22c55e',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '1rem',
              transition: 'background-color 0.3s'
            }}
          >
            {isLoading ? <ClipLoader color="#fff" size={20} /> : "Upload Sound"}
          </button>
          {errorMessage && <p style={{ color: '#ef4444' }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: '#22c55e' }}>{successMessage}</p>}
        </div>
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={closeModal}>
          <div style={{
            position: 'fixed',
            zIndex: 10,
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Dialog.Panel style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
              width: '300px',
            }}>
              <Dialog.Title style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Playing Sound</Dialog.Title>
              <audio controls src={currentSound} style={{ width: '100%', marginBottom: '1rem' }} />
              <button
                onClick={closeModal}
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              {errorMessage && <p style={{ color: '#ef4444' }}>{errorMessage}</p>}
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default CreateSound;
