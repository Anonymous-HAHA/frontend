import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlayCircle } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { Dialog } from "@headlessui/react";
import Cookies from 'js-cookie';
import env from "../../env";

const AllSounds = () => {
  const [sounds, setSounds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSoundsLoading, setIsSoundsLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isSaveLoading, setIsSaveLoading] = useState(false);

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

  const handleEditTitle = (soundId, currentTitle) => {
    setEditingTitle(soundId);
    setNewTitle(currentTitle);
  };

  const handleTitleChange = async (soundId) => {
    if (!newTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    setIsSaveLoading(true);

    try {
      await axios.put(`${env.SERVER_URL}/change/sound/title/${soundId}`, { title: newTitle }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('jwtToken')}`
        }
      });

      setSounds(prevSounds => prevSounds.map(sound => 
        sound._id === soundId ? { ...sound, name: newTitle } : sound
      ));

      setEditingTitle(null);
    } catch (error) {
      console.error("Error updating title:", error);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTitle(null);
    setNewTitle('');
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

        {isSoundsLoading ? (
          <ClipLoader color="#000" loading={isSoundsLoading} size={50} />
        ) : sounds.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '1.25rem' }}>No voice messages yet</p>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            width: '100%',
          }}>
            {sounds.map((sound) => (
              <div key={sound._id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#000',
                color: '#fff',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.5rem',
                width: '100%',
                maxWidth: '600px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                flexDirection: 'column', // Stack on mobile
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexGrow: 1
                  }}>
                    <FaPlayCircle size={24} onClick={() => handlePlaySound(sound._id)} style={{ cursor: 'pointer' }} />
                    <span onClick={() => handlePlaySound(sound._id)} style={{ cursor: 'pointer' }}>
                      {sound.name}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleEditTitle(sound._id, sound.name)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <MdModeEditOutline size={24} />
                  </button>
                </div>
                
                {editingTitle === sound._id && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '0.5rem'
                  }}>
                    <input 
                      type="text"
                      value={newTitle}
                      required
                      onChange={(e) => setNewTitle(e.target.value)}
                      style={{
                        width: '90%',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        marginBottom: '0.5rem',
                        border: '1px solid #ccc',
                        color : '#000'
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center',
                      width: '100%'
                    }}>
                      <button 
                        onClick={() => handleTitleChange(sound._id)}
                        disabled={!newTitle.trim() || newTitle === sound.name || isSaveLoading}
                        style={{
                          backgroundColor: !newTitle.trim() || newTitle === sound.name ? '#999' : '#4caf50',
                          color: '#fff',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.9rem',
                          cursor: (!newTitle.trim() || newTitle === sound.name || isSaveLoading) ? 'not-allowed' : 'pointer',
                          width: '45%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSaveLoading ? <ClipLoader color="#fff" size={16} /> : 'Save'}
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        style={{
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          width: '45%'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  marginBottom: '1rem'
                }}>
                  Voice Recording
                </h3>
                {isLoading ? (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100px'
                  }}>
                    <ClipLoader color="#000" loading={isLoading} size={50} />
                  </div>
                ) : ( currentSound && (
                    <audio controls  style={{
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
