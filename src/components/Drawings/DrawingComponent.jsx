import React, { useRef, useState, useEffect } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { SketchPicker } from 'react-color';
import axios from 'axios';
import Cookies from 'js-cookie';
import env from '../../env';
import ClipLoader from 'react-spinners/ClipLoader';

const styles = {
  border: '0.0625rem solid #9c9c9c',
  borderRadius: '0.25rem',
  maxWidth: '100%',
  maxHeight: '100%',
};

const DrawingComponent = () => {
  const canvasRef = useRef(null);
  const [strokeColor, setStrokeColor] = useState('black');
  const [canvasColor, setCanvasColor] = useState('white');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [eraserWidth, setEraserWidth] = useState(8);
  const [isEraser, setIsEraser] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [drawings, setDrawings] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const token = Cookies.get('jwtToken');

  const fetchDrawings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${env.SERVER_URL}/get/drawings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update: Decode base64 strings and set drawings
      console.log(response.data);
      // const decodedDrawings = response.data.map((drawing) => ({
      //   ...drawing,
      //   pic: drawing.pic ? atob(drawing.pic) : '', // Decode base64 string
      // }));
      setDrawings(response.data);
    } catch (error) {
      console.error('Error fetching drawings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDrawing = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${env.SERVER_URL}/delete/drawing/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDrawings(drawings.filter((drawing) => drawing._id !== id));
      console.log('Drawing deleted successfully.');
    } catch (error) {
      console.error('Error deleting the drawing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDrawing = async () => {
    setLoading(true);
    try {
      const image = await canvasRef.current.exportImage('png');
      console.log('Image saved:', image);
      await axios.post(
        `${env.SERVER_URL}/upload/drawing`,
        { imageBase64: image, title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Drawing saved successfully.');
      setTitle('');
      fetchDrawings();
    } catch (error) {
      console.error('Error saving the drawing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEraserToggle = () => {
    setIsEraser(!isEraser);
    if (!isEraser) {
      setStrokeColor(canvasColor);
    } else {
      setStrokeColor('black');
    }
  };

  useEffect(() => {
    fetchDrawings();
  }, []);

  return (
    <div className="drawing-container p-4">
      <div className="flex flex-col items-center md:flex-row">
        <ReactSketchCanvas
          ref={canvasRef}
          style={styles}
          width="100%"
          height="400px"
          strokeColor={strokeColor}
          canvasColor={canvasColor}
          strokeWidth={isEraser ? eraserWidth : strokeWidth}
          eraserWidth={eraserWidth}
          backgroundImage={backgroundImage}
        />

        <div className="controls mt-4 md:mt-0 md:ml-4 flex flex-col items-center">
          <label className="mb-2">Pen Color:</label>
          <SketchPicker
            color={strokeColor}
            onChangeComplete={(color) => !isEraser && setStrokeColor(color.hex)}
          />

          <label className="mt-4 mb-2">Canvas Color:</label>
          <SketchPicker color={canvasColor} onChangeComplete={(color) => setCanvasColor(color.hex)} />

          <label className="mt-4 mb-2">Pen Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            disabled={isEraser}
          />

          <label className="mt-4 mb-2">Eraser Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={eraserWidth}
            onChange={(e) => setEraserWidth(parseInt(e.target.value))}
          />

          <button
            onClick={handleEraserToggle}
            className={`mt-4 p-2 rounded ${isEraser ? 'bg-red-500' : 'bg-green-500'} text-white`}
          >
            {isEraser ? 'Switch to Pen' : 'Switch to Eraser'}
          </button>

          <label className="mt-4 mb-2">Background Image URL:</label>
          <input
            type="text"
            className="p-2 border rounded"
            value={backgroundImage}
            onChange={(e) => setBackgroundImage(e.target.value)}
          />

          <label className="mt-4 mb-2">Drawing Title:</label>
          <input
            type="text"
            className="p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleSaveDrawing}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        disabled={!title} // Disable button if title is empty
      >
        Save Drawing
      </button>

      <div className="drawings mt-4">
        <h2 className="text-lg font-bold">My Drawings</h2>
        {loading ? (
          <ClipLoader loading={loading} size={50} />
        ) : drawings.length > 0 ? (
          <div className="flex flex-wrap">
            {drawings.map((drawing) => (
              <div key={drawing._id} className="relative m-2">
                <img
                  src={`${drawing.pic}`} // Use the pic property for the image
                  alt={`Drawing ${drawing.title}`}
                  className="border rounded"
                  style={{ width: '150px', height: '150px' }}
                />
                <button
                  onClick={() => handleDeleteDrawing(drawing._id)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
                <div className="text-center mt-1">{drawing.title}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No images yet.</p>
        )}
      </div>
    </div>
  );
};

export default DrawingComponent;
